import * as http from 'http';

import { HttpRequest, HttpMethod, HttpRequestHeadersObject } from '../core/request';

export class NodeHttpRequest implements HttpRequest {

  method: HttpMethod;
  uri: string;
  httpVersion: string;
  headers: HttpRequestHeadersObject;
  body: string;

  constructor(private request: http.IncomingMessage) {
    this.method = <any>request.method;
    this.uri = request.url!;
    this.headers = <any>request.headers;
    this.httpVersion = request.httpVersion;
    this.body = null;
  }

  readBody(): Promise<void> {
    return new Promise((resolve, reject) => {
      const data: any = [];
      this.request
        .on('error', error => {
          reject(error);
        })
        .on('data', chunk => {
          data.push(chunk);
        })
        .on('end', () => {
          this.body = String.fromCharCode.apply(null, new Uint16Array(data));
          resolve();
        });
    });
  }
}
