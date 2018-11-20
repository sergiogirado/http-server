import { TcpServer } from './tcp-server';
import { HttpServer, HttpRequestHandler } from '../core/server';
import { CustomHttpResponse } from './response';
import { CustomHttpRequest } from './request';

export class CustomHttpServer implements HttpServer {
  constructor(
    private tcpServer: TcpServer,
    private requestHandler: HttpRequestHandler
  ) {
    this.tcpServer.connections$.subscribe(async client => {
      const response = new CustomHttpResponse(client);

      try {
        const request = new CustomHttpRequest(client);
        await request.readBody();
        this.requestHandler(request, response);
      } catch (error) {
        response.setStatus(400);
        response.json({ error });
      }
    });
  }

  listen(port: number): Promise<void> {
    return this.tcpServer.listen(port);
  }

  stop() {
    return this.tcpServer.stop();
  }
}
