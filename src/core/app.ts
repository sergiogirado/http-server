import { HttpRequest } from './request';
import { HttpResponse } from './response';
import { HttpServer, HttpServerFactory } from './server';
import { HttpMiddleware, HttpMiddlewareFunction } from './middleware';

export class HttpApp {
    private server: HttpServer;
    private middlewares: HttpMiddleware[] = [];

    constructor(
        private serverFactory: HttpServerFactory
    ) { }

    /**
     * Registers a middleware to include in the request pipeline
     */
    public use(middleware: HttpMiddleware) {
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

    private reduceMiddlewares(request: HttpRequest, response: HttpResponse, middlewares: HttpMiddleware[]) {
        const middleware = middlewares.shift();
        if (!middleware) {
            this.notFoundResult(request, response, () => { });
            return;
        }
        middleware.handleRequest(request, response, () => {
            this.reduceMiddlewares(request, response, middlewares);
        });
    }

    private notFoundResult: HttpMiddlewareFunction = (request, response) => {
        response.setStatus(404);
        response.end();
    }
}
