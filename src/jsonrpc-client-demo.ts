import { connect } from "amqplib";
import { JsonRpcClient } from "./lib/jsonrpc-client";
import { HelloWorld } from "./lib/demo/json-rpc";

async function run(): Promise<void> {
    const connection = await connect({
        hostname: "localhost",
        port: 5672,
        username: "guest",
        password: "guest"
    });

    const channel = await connection.createChannel();
    const hello = JsonRpcClient.create<HelloWorld>(channel, 'rpcqueue');
    console.log(await hello.hello());
    console.log(await hello.helloWho({ first: "Foo", last: "Bar" }));
    try {
        await hello.helloError();
    } catch(err) {
        console.log("Caught error as expected: ", err);
    }
}

run().then(() => process.exit(0));
