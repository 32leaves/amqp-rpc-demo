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

    const expectedDelay = Math.random() * 5000;
    const now = Date.now();
    const resp = await client.call({
        delay: expectedDelay,
        msg: uuid()
    });
    console.log("Response", resp);
    console.log(`Expected to wait ${expectedDelay} ms, waited for ${Date.now() - now} ms (incl. RTT)`);
}

run().then(() => process.exit(0));
