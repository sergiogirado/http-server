import { ChromeTcpSocket } from '../src/chrome/tcp-socket';
import { GenericHttpServerFactory } from '../src/generic/server-factory';
import { NodeTcpSocket } from '../src/node/tcp-socket';
import { NodeHttpServerFactory } from '../src/node/server-factory';
import { HttpServerFactory } from '../src/core/server';
import { HttpApp } from '../src/core/app';
import { ApiMiddleware } from '../src/core/api';
import { SimpleApi } from './api';

export class DemoProgram {

  startGenericChrome() {
    const socket = new ChromeTcpSocket();
    this.common(new GenericHttpServerFactory(socket));
  }

  startGenericNode() {
    const socket = new NodeTcpSocket();
    this.common(new GenericHttpServerFactory(socket));
  }

  startNode() {
    this.common(new NodeHttpServerFactory());
  }

  common(factory: HttpServerFactory) {
    const app = new HttpApp(factory);
    app.use(new ApiMiddleware([new SimpleApi]).onRequest);
    app.use((request, response, next) => {
      response.setStatus(404);
      response.json({ message: 'Not Found' });
      response.end();
    });

    app.start(3001).then(() => console.log('Listening on port 3001')); // tslint:disable-line:no-console
  }
}