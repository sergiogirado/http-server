import { HttpServerFactory, HttpServer, HttpRequestHandler } from '../core/server';
import { CustomHttpServer } from './server';
import { TcpServer } from './tcp-server';

export class CustomHttpServerFactory implements HttpServerFactory {
  constructor(private tcpSocket: TcpServer) { }
  createServer(requestHandler: HttpRequestHandler): Promise<HttpServer> {
    return Promise.resolve(new CustomHttpServer(this.tcpSocket, requestHandler));
  }
}