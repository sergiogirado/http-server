import * as http from 'http';

import { HttpServer, HttpRequestHandler } from '../core/server';
import { NodeHttpResponse } from './response';
import { NodeHttpRequest } from './request';

export class NodeHttpServer implements HttpServer {
    private server: http.Server;

    constructor(
        private requestHandler: HttpRequestHandler
    ) {
        this.server = http.createServer(async (request, response) => {
            try {
                const httpRequest = await NodeHttpRequest.fromRequest(request);
                const httpResponse = new NodeHttpResponse(response);
                this.requestHandler(httpRequest, httpResponse);
            } catch (error) {
                throw error;
            }
        });
    }

    listen(port: number) {
        this.server.listen(port);
        return Promise.resolve();
    }

    stop() {
        return new Promise<void>((resolve, reject) => {
            this.server.close(() => resolve());
        });
    }
}
