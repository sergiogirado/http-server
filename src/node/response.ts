import * as http from 'http';

import { HttpResponse, HttpStatusCode, HttpReasonPhraseMap, HttpResponseHeaderName } from '../core/response';

export class NodeHttpResponse implements HttpResponse {
    constructor(private response: http.ServerResponse) { }

    end() {
        this.response.end();
    }

    getStatus() {
        return this.response.statusCode;
    }

    setStatus(code: HttpStatusCode) {
        this.response.statusCode = code;
        this.response.statusMessage = HttpReasonPhraseMap[code];
    }

    getHeader(name: HttpResponseHeaderName) {
        return <any>this.response.getHeader(name);
    }
    setHeader(name: HttpResponseHeaderName, value: string) {
        this.response.setHeader(name, value);
    }
    text(text: string) {
        this.response.setHeader('Content-Type', 'text/plain')
        this.response.write(text);
    }
    json<T>(data: T) {
        this.response.setHeader('Content-Type', 'application/json')
        this.response.write(JSON.stringify(data));
    }
}