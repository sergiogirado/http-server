import { HttpRequestHandler, HttpServer, HttpServerFactory } from '../core/server';
import { NodeHttpServer } from './server';

/**
 * Node http server factory implementation
 */
export class NodeHttpServerFactory implements HttpServerFactory {
  public createServer(requestHandler: HttpRequestHandler): Promise<HttpServer> {
    return Promise.resolve(new NodeHttpServer(requestHandler));
  }
}
