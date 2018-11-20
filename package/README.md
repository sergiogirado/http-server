# http-server
Simple HTTP Server built from scratch

# Usage
```typescript
import { ChromeTcpSocket } from './chrome/tcp-socket';
import { GenericHttpServerFactory } from './generic/server-factory';
import { NodeHttpServerFactory } from './node/server-factory';
import { HttpServerFactory } from './core/server';
import { HttpApp } from './core/app';
import { NodeTcpSocket } from './node/tcp-socket';
import { HttpGet, HttpRoutePrefix, ApiMiddleware } from './core/api';

@HttpRoutePrefix('api/demo')
export class SimpleApi {

  @HttpGet('values')
  getValues() {
    return ['val 1', 'val 2'];
  }

  @HttpGet('values/async')
  getValuesAsync() {
    return Promise.resolve(['val 1', 'val 2']);
  }
}

export class Demo {

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

const demo = new Demo();
demo.startGenericNode();
```