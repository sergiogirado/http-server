# http-server
Simple HTTP Server built from scratch

# Usage
```typescript
import { ChromeTcpSocket } from './chrome/chrome-tcp-socket';
import { GenericHttpServerFactory } from './generic/server-factory';
import { NodeHttpServerFactory } from './node/server-factory';
import { HttpServerFactory } from './core/server';
import { HttpApp } from './core/app';

export class App {
    startGeneric() {
        const socket = new ChromeTcpSocket(); // Or any custom implementation of TCP Server Socket
        this.common(new GenericHttpServerFactory(socket));
    }

    startNode() {
        this.common(new NodeHttpServerFactory());
    }

    common(factory: HttpServerFactory) {
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
}

```