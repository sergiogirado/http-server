import { ChromeTcpServer } from '../src/chrome/tcp-server';
import { ApiMiddleware } from '../src/core/api';
import { HttpApp } from '../src/core/app';
import { HttpServerFactory } from '../src/core/server';
import { CustomHttpServerFactory } from '../src/custom/server-factory';
import { NodeHttpServerFactory } from '../src/node/server-factory';
import { NodeTcpServer } from '../src/node/tcp-server';
import { SimpleApi } from './api';

/**
 * Demo program
 */
export class DemoProgram {

  public startCustomChrome() {
    const tcpServer = new ChromeTcpServer();
    this.common(new CustomHttpServerFactory(tcpServer));
  }

  public startCustomNode() {
    const tcpServer = new NodeTcpServer();
    this.common(new CustomHttpServerFactory(tcpServer));
  }

  public startNode() {
    this.common(new NodeHttpServerFactory());
  }

  public common(factory: HttpServerFactory) {
    const app = new HttpApp(factory);
    app.use(new ApiMiddleware([new SimpleApi()]).onRequest);
    app.use((request, response, next) => {
      response.setStatus(404);
      response.json({ message: 'Not Found' });
      response.end();
    });

    app.start(3001).then(() => console.log('Listening on port 3001')); // tslint:disable-line:no-console
  }
}
