import * as http from 'http';

import { HttpRequest, HttpMethod, HttpRequestHeadersObject } from '../core/request';

export class NodeHttpRequest implements HttpRequest {

    public static async fromRequest(request: http.IncomingMessage) {
        const body = await this.readBody(request);
        return <NodeHttpRequest>{
            method: <any>request.method,
            uri: request.url!,
            headers: <any>request.headers,
            httpVersion: request.httpVersion,
            body: body
        };
    }

    method: HttpMethod;
    uri: string;
    httpVersion: string;
    headers: HttpRequestHeadersObject;
    body: string;

    private static readBody(request: http.IncomingMessage): Promise<string> {
        return new Promise((resolve, reject) => {
            const data: any = [];
            request.on('error', (error: any) => {
                reject(error);
            }).on('data', (chunk: any) => {
                data.push(chunk);
            }).on('end', () => {
                const body = String.fromCharCode.apply(null, new Uint16Array(data));
                resolve(body);
            });
        });
    }
}
