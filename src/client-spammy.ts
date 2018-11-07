import { connect } from "amqplib";
import { RpcClient } from "./lib/rpc-client";
import { DemoReq, DemoResp } from "./lib/demo-rpc-server";
import { v4 as uuid } from 'uuid';

async function run(): Promise<void> {
    const connection = await connect({
        hostname: "localhost",
        port: 5672,
        username: "guest",
        password: "guest"
    });

    const channel = await connection.createChannel();
    const client = new RpcClient<DemoReq, DemoResp>(channel, "rpcqueue");
    
    while(true) {
        await client.call({
            delay: 1,
            msg: uuid()
        });
    }
}

run().then(() => process.exit(0));
