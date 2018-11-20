import { TcpSocket } from './tcp';
import { HttpServer, HttpRequestHandler } from '../core/server';
import { GenericHttpResponse } from './response';
import { GenericHttpRequest } from './request';

export class GenericHttpServer implements HttpServer {
  constructor(
    private tcpSocket: TcpSocket,
    private requestHandler: HttpRequestHandler
  ) {
    this.tcpSocket.messages$.subscribe(receivedData => {
      const response = new GenericHttpResponse(this.tcpSocket, receivedData.clientSocketId);

      try {
        const request = new GenericHttpRequest(tcpSocket, receivedData.clientSocketId, receivedData.data);
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
