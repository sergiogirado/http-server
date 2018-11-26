import * as http from 'http';

import { HttpMethod, HttpRequest, HttpRequestHeadersObject, HttpUri } from '../core/request';

/**
 * Node http request implementation
 */
export class NodeHttpRequest implements HttpRequest {

  public method: HttpMethod;
  public uri: HttpUri;
  public httpVersion: string;
  public headers: HttpRequestHeadersObject;
  public body: string;

  constructor(private request: http.IncomingMessage) {
    this.method = <any>request.method;
    this.uri = new HttpUri(request.url);
    this.headers = <any>request.headers;
    this.httpVersion = request.httpVersion;
    this.body = null;
  }

  public read(): Promise<void> {
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
