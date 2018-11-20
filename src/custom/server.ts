import { TcpServer } from './tcp-server';
import { HttpServer, HttpRequestHandler } from '../core/server';
import { CustomHttpResponse } from './response';
import { CustomHttpRequest } from './request';

export class CustomHttpServer implements HttpServer {
  constructor(
    private tcpSocket: TcpServer,
    private requestHandler: HttpRequestHandler
  ) {
    this.tcpSocket.messages$.subscribe(receivedData => {
      const response = new CustomHttpResponse(this.tcpSocket, receivedData.clientSocketId);

      try {
        const request = new CustomHttpRequest(tcpSocket, receivedData.clientSocketId, receivedData.data);
        this.requestHandler(request, response);
      } catch (error) {
        response.setStatus(400);
        response.json({ error });
      }
    });
  }

  listen(port: number): Promise<void> {
    return this.tcpSocket.listen(port);
  }

  stop() {
    return this.tcpSocket.stop();
  }
}
