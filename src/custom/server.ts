import { HttpRequestHandler, HttpServer } from '../core/server';
import { CustomHttpRequest } from './request';
import { CustomHttpResponse } from './response';
import { TcpServer } from './tcp-server';

/**
 * Custom Http server implementation
 */
export class CustomHttpServer implements HttpServer {
  constructor(
    private tcpServer: TcpServer,
    private requestHandler: HttpRequestHandler
  ) {
    this.tcpServer.connections$.subscribe(async client => {
      const response = new CustomHttpResponse(client);

      try {
        const request = new CustomHttpRequest(client);
        await request.read();
        this.requestHandler(request, response);
      } catch (error) {
        response.setStatus(400);
        response.json({ error });
      }
    });
  }

  public listen(port: number): Promise<void> {
    return this.tcpServer.listen(port);
  }

  public stop() {
    return this.tcpServer.stop();
  }
}
