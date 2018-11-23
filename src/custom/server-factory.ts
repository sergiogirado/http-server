import { HttpRequestHandler, HttpServer, HttpServerFactory } from '../core/server';
import { CustomHttpServer } from './server';
import { TcpServer } from './tcp-server';

/**
 * Custom Http server factory
 */
export class CustomHttpServerFactory implements HttpServerFactory {
  constructor(private tcpSocket: TcpServer) { }
  public createServer(requestHandler: HttpRequestHandler): Promise<HttpServer> {
    return Promise.resolve(new CustomHttpServer(this.tcpSocket, requestHandler));
  }
}
