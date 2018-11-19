import * as http from 'http';

import { HttpServer, HttpRequestHandler } from '../core/server';
import { HttpRequest } from '../core/request';
import { HttpResponse } from '../core/response';
import { NodeHttpResponse } from './response';

export class NodeHttpServer implements HttpServer {
    private server: http.Server;

    constructor(
        private requestHandler: HttpRequestHandler
    ) {
        this.server = http.createServer(async (request, response) => {
            try {
                const body = await this.onData(request);
                this.onReceiveData(request, response, body);
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
    private onReceiveData(request: http.IncomingMessage, response: http.ServerResponse, body: string) {
        const httpRequest = this.getRequest(request, body);
        const httpResponse = this.getResponse(response);
        this.requestHandler(httpRequest, httpResponse);
    }

    private getRequest(request: http.IncomingMessage, body: any): HttpRequest {
        return new HttpRequest({
            method: <any>request.method,
            uri: request.url!,
            headers: <any>request.headers,
            httpVersion: request.httpVersion,
            body: body
        });
    }

    private getResponse(response: http.ServerResponse) {
        return new NodeHttpResponse(response);
    }
    private onData(request: http.IncomingMessage): Promise<string> {
        return new Promise((resolve, reject) => {
            const data: any = [];
            request.on('error', (error: any) => {
                reject(error);
            }).on('data', (chunk: any) => {
                data.push(chunk);
            }).on('end', () => {
                const body = this.decode(data);
                resolve(body);
            });
        });
    }

    private decode(data: ArrayBuffer): string {
        return String.fromCharCode.apply(null, new Uint16Array(data));
    }
}
