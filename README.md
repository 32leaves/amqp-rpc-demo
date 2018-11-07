# amqp-rpc-demo

Playground for implementing RPC using RabbitMQ, losely based on
 * https://facundoolano.wordpress.com/2016/06/26/real-world-rpc-with-rabbitmq-and-node-js/
 * https://www.rabbitmq.com/tutorials/tutorial-six-javascript.html

This example implements 
 * a server which can wait for some time before returning,
 * a client which sends a single message and prints the response, and
 * a client which keeps sending messages until it is stopped.


# Usage
### Build stuff
```
yarn install && yarn build
```

### Start a RabbitMQ broker
```
docker run -d --hostname localhost --name some-rabbit -p 5672:5672 -p 8080:15672 rabbitmq:3-management
```

### Start a bunch of RPC server
```
yarn run start-servers 5
```

### Run a single client
```
node build/main/client-single.js
```

### Run a load of spammy clients
```
yarn run start-spammers 10
open http://localhost:8080 # open rabbitmq mgmt interface to observe rpcqueue
```
