import { HttpMethod } from './method';
import { HttpRequestHeadersObject } from './headers';

export interface HttpRequestData {
    method: HttpMethod;
    uri: string;
    httpVersion: string;
    headers: HttpRequestHeadersObject;
    body: string;
}

export class HttpRequest implements HttpRequestData {
    method: HttpMethod;
    uri: string;
    httpVersion: string;
    headers: HttpRequestHeadersObject;
    body: string;
    public static fromString(data: string) {
        const [head, body] = data.split(/\r?\n\r?\n/);
        const headLines = head.split(/\r*\n/);
        const requestLine = headLines.shift()!;
        const [method, uri, httpVersion] = requestLine.split(' ');
        const headers = headLines.reduce<HttpRequestHeadersObject>((previous, line) => {
            const index = line.indexOf(':');
            const key = line.substring(0, index);
            const value = line.substring(index + 2, line.length);
            const current: HttpRequestHeadersObject = {};
            current[key] = value;
            return { ...previous, ...current };
        }, {});


        const fixedBody = headers['Content-Type'] === 'application/json'
            ? JSON.parse(body)
            : body;


        return new HttpRequest({
            method: <HttpMethod>method,
            uri,
            httpVersion,
            headers,
            body: fixedBody
        });
    }

    constructor(
        readonly data: HttpRequestData
    ) {
        this.method = data.method;
        this.uri = data.uri;
        this.httpVersion = data.httpVersion;
        this.headers = data.headers;
        this.body = data.body;
    }
}
