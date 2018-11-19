import { ChromeTcpSocket } from './chrome/chrome-tcp-socket';
import { GenericHttpServerFactory } from './generic/server-factory';
import { HttpApp } from './core/app';
import { NodeHttpServerFactory } from './node/server-factory';

export class App {
    constructor(node: boolean) {
        const factory = node ? this.node() : this.generic();
        const app = new HttpApp(factory);
        app.use({
            handleRequest: (request, response, next) => {
                response.setStatus(200);
                response.json({ message: 'Hello world!' });
                response.end();
            }
        });
        app.start(3001).then(() => console.log('Listening on port 3001'));
    }

    generic() {
        const socket = new ChromeTcpSocket();
        return new GenericHttpServerFactory(socket);
    }

    node() {
        return new NodeHttpServerFactory();
    }
}
