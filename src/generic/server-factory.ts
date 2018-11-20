import { HttpServerFactory, HttpServer, HttpRequestHandler } from '../core/server';
import { GenericHttpServer } from './server';
import { TcpSocket } from './tcp';

export class GenericHttpServerFactory implements HttpServerFactory {
  constructor(private tcpSocket: TcpSocket) { }
  createServer(requestHandler: HttpRequestHandler): Promise<HttpServer> {
    return Promise.resolve(new GenericHttpServer(this.tcpSocket, requestHandler));
  }
}