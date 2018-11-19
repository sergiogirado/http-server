import { HttpServerFactory, HttpServer, HttpRequestHandler } from '../core/server';
import { NodeHttpServer } from './server';

export class NodeHttpServerFactory implements HttpServerFactory {
    createServer(requestHandler: HttpRequestHandler): Promise<HttpServer> {
        return Promise.resolve(new NodeHttpServer(requestHandler));
    }
}