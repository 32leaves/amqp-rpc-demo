import { Channel } from "amqplib";
import { v4 as uuid } from "uuid";
import { EventEmitter } from "events";

const REPLY_QUEUE = 'amq.rabbitmq.reply-to';

export class RpcClient<Req, Resp> {

    protected readonly channel: RpcClientChannel;

    constructor(channel: Channel, protected readonly queueName: string) {
        this.channel = channel as RpcClientChannel;
        if (!this.channel.rpcResponseEmitter) {
            this.channel.rpcResponseEmitter = new EventEmitter();
            this.channel.rpcResponseEmitter.setMaxListeners(0);
            this.channel.consume(REPLY_QUEUE,
                msg => this.channel.rpcResponseEmitter.emit(msg.properties.correlationId, msg.content),
                {noAck: true});
        }
    }

    async call(req: Req): Promise<Resp> {
        const correlationId = uuid();
        const message = new Buffer(JSON.stringify(req));
        this.channel.sendToQueue(this.queueName, message, { correlationId, replyTo: REPLY_QUEUE });

        return new Promise<Resp>((resolve, reject) => {
            try {
                this.channel.rpcResponseEmitter.once(correlationId, msg => resolve(JSON.parse(msg)));
            } catch(err) {
                reject(err)
            }
        });
    }

}

type RpcClientChannel = Channel & { rpcResponseEmitter: EventEmitter };