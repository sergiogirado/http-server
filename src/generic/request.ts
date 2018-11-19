import { HttpRequest, HttpMethod, HttpRequestHeadersObject } from '../core/request';

export class GenericHttpRequest implements HttpRequest {
    method: HttpMethod;
    uri: string;
    httpVersion: string;
    headers: HttpRequestHeadersObject;
    body: string;

    constructor(
        readonly data: string
    ) {
        const [head, body] = data.split(/\r?\n\r?\n/);
        const headLines = head.split(/\r?\n/);
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

        this.method = <HttpMethod>method;
        this.uri = uri;
        this.httpVersion = httpVersion;
        this.headers = headers;
        this.body = fixedBody;
    }
}