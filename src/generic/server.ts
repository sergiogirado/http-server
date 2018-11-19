import { TcpSocket } from './tcp';
import { HttpServer, HttpRequestHandler } from '../core/server';
import { HttpRequest } from '../core/request';

import { GenericHttpResponse } from './response';

export class GenericHttpServer implements HttpServer {
    constructor(
        private tcpSocket: TcpSocket,
        private requestHandler: HttpRequestHandler
    ) {
        this.tcpSocket.messages$.subscribe(receivedData => {
            const response = new GenericHttpResponse(this.tcpSocket, receivedData.clientSocketId);

            try {
                const stringRquest: string = String.fromCharCode.apply(null, new Uint8Array(receivedData.data));
                const request = HttpRequest.fromString(stringRquest);
                this.requestHandler(request, response);
            } catch (error) {
                response.status = 400;
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
