import { RpcServer } from "./rpc-server";
import { Message, Channel } from "amqplib";

export interface JsonRpcRequest {
    jsonrpc: "2.0",
    method: string,
    params?: any,
    id: string | number | null
}

export interface JsonRpcResponse {
    jsonrpc: "2.0",
    result?: any,
    error?: {
        code: number,
        message: string,
        data?: any
    },
    id: string | number | null
}

export class JsonRpcServer extends RpcServer<JsonRpcRequest, JsonRpcResponse> {

    constructor(protected readonly delegate: any, channel: Channel, queueName: string) {
        super(channel, queueName);
    }

    protected async doHandle(msg: Message) {
        const reply = async function(resp: JsonRpcResponse) {
            this.channel.publish('', msg.properties.replyTo, new Buffer(JSON.stringify(resp)), {
                correlationId: msg.properties.correlationId
            });
        }

        let req: JsonRpcRequest;
        try {
            req = JSON.parse(msg.content.toString()) as JsonRpcRequest;
        } catch(err) {
            await reply(this.buildResponse({ error: { code: -32700, message: "Parse error" } }, req));
            return;
        }

        try {
            const resp = await this.handleRequest(req, msg);
            await reply(resp);
        } catch(err) {
            await reply(this.buildResponse({ error: { code: -32603, message: "Internal error" } }, req));
        }
    }

    protected async handleRequest(req: JsonRpcRequest, _msg: Message): Promise<JsonRpcResponse> {
        if(req.method in this.delegate) {
            try {
                const result = this.delegate[req.method](...req.params);
                return this.buildResponse({ result }, req);
            } catch(err) {
                return this.buildResponse({ error: { code: 0, message: err.message, data: err } }, req);
            }
        } else {
            return this.buildResponse({ error: { code: -32601, message: "Method not found" } }, req);
        }
    }

    protected buildResponse(content: Partial<JsonRpcResponse>, req?: JsonRpcRequest): JsonRpcResponse {
        return {
            jsonrpc: "2.0",
            id: req ? req.id : null,
            ...content
        }
    }

}