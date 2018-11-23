import * as http from 'http';

import { HttpMethod, HttpRequest, HttpRequestHeadersObject } from '../core/request';

/**
 * Node http request implementation
 */
export class NodeHttpRequest implements HttpRequest {

  public method: HttpMethod;
  public uri: string;
  public httpVersion: string;
  public headers: HttpRequestHeadersObject;
  public body: string;

  constructor(private request: http.IncomingMessage) {
    this.method = <any>request.method;
    this.uri = request.url;
    this.headers = <any>request.headers;
    this.httpVersion = request.httpVersion;
    this.body = null;
  }

  public readBody(): Promise<void> {
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
