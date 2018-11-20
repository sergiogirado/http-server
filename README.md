# http-server
Simple HTTP Server built from scratch

# Demo
You can run a demo with `npm run demo:start`

The source code of the demo is in `./demo`

# Usage
```typescript
@HttpRoutePrefix('demo')
export class SimpleApi {

  @HttpGet('values')
  getValues() {
    return ['val 1', 'val 2'];
  }

  @HttpGet('values/async')
  getValuesAsync() {
    return Promise.resolve(['val 1', 'val 2']);
  }

  @HttpGet('error')
  getValuesAsync() {
    return Promise.reject(new Error('Error fromrejected promise'));
  }

  @HttpGet('error/custom')
  getValuesAsync() {
    throw new HttpError(401, 'No permissions');
  }
}

export class Demo {
  start() {
    const tcp = new NodeTcpServer();
    const factory = new CustomHttpServerFactory(tcp);
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

const demo = new Demo();
demo.start();
```