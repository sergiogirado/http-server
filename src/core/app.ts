import { HttpRequest } from './request';
import { HttpResponse } from './response';
import { HttpServer, HttpServerFactory } from './server';

/**
 * Http Application that can be configured with middlewares
 */
export class HttpApp {
  private server: HttpServer;
  private middlewares: HttpMiddlewareFunction[] = [];

  constructor(
    private serverFactory: HttpServerFactory
  ) { }

  /**
   * Registers a middleware to include in the request pipeline
   */
  public use(middleware: HttpMiddlewareFunction) {
    this.middlewares.push(middleware);
  }

  /**
   * Create the httpServer intance with the correct adapter (depends of the platform).
   * Start listen by the port configured.
   */
  public async start(port: number) {
    this.server = await this.serverFactory.createServer((request, response) => {
      this.reduceMiddlewares(request, response, [...this.middlewares]);
    });
    this.server.listen(port);
  }

  private reduceMiddlewares(request: HttpRequest, response: HttpResponse, middlewares: HttpMiddlewareFunction[]) {
    const middleware = middlewares.shift();
    if (!middleware) {
      this.notFoundResult(request, response, () => { /* never */ });

      return;
    }

    middleware(request, response, () => {
      this.reduceMiddlewares(request, response, middlewares);
    });
  }

  private notFoundResult: HttpMiddlewareFunction = (request, response) => {
    response.setStatus(404);
    response.end();
  }
}

export type HttpMiddlewareFunction = (request: HttpRequest, reponse: HttpResponse, next: () => void) => void;
