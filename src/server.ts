import { connect } from "amqplib";
import { DemoRpcServer } from "./lib/demo-rpc-server";

async function run(): Promise<void> {
    const connection = await connect({
        hostname: "localhost",
        port: 5672,
        username: "guest",
        password: "guest"
    });

    const channel = await connection.createChannel();
    const server = new DemoRpcServer(process.argv[2], channel, "rpcqueue");
    await server.start();
    console.log(`Server started: ${server.id}`);

    await new Promise((_rs, _rj) => {});
}

run().then();
