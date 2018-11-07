import { connect } from "amqplib";
import { JsonRpcServer } from "./lib/jsonrpc-server";
import { HelloWorld, Person, PersonWithHello } from "./lib/demo/json-rpc";

class HelloServer implements HelloWorld {
    constructor(public readonly id: string) { }

    hello(): string {
        return `Hello from ${this.id}`
    }
    helloWho(person: Person): PersonWithHello {
        return {
            ...person,
            hello: this.hello()
        }
    }

    helloError(): void {
        throw new Error("Method not implemented.");
    }

}

async function run(): Promise<void> {
    const connection = await connect({
        hostname: "localhost",
        port: 5672,
        username: "guest",
        password: "guest"
    });

    const channel = await connection.createChannel();
    const delegate = new HelloServer(process.argv[2]);
    const server = new JsonRpcServer(delegate, channel, "rpcqueue");
    await server.start();
    console.log(`Server started: ${delegate.id}`);

    await new Promise((_rs, _rj) => {});
}

run().then();
