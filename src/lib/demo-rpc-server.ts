import { RpcServer } from "./rpc-server";
import { Message, Channel } from "amqplib";

export interface DemoReq {
    delay: number
    msg: string
}

export interface DemoResp {
    server: string,
    time: Date
}

export class DemoRpcServer extends RpcServer<DemoReq, DemoResp> {

    constructor(public readonly id: string, channel: Channel, queueName: string) {
        super(channel, queueName);
    }

    protected async handleRequest(req: DemoReq, _msg: Message): Promise<DemoResp> {
        // console.log(`task ${req.msg} waiting ${req.delay}`);
        return new Promise<DemoResp>((resolve, _reject) => {
            setTimeout(() => {
                // console.log(`task ${req.msg} done`);
                resolve({
                    server: this.id,
                    time: new Date()
                });
            }, req.delay);
        });
    }
    
}