import * as http from 'http';

import { HttpReasonPhraseMap, HttpResponse, HttpResponseHeaderName, HttpStatusCode } from '../core/response';

/**
 * Node Http response implementation
 */
export class NodeHttpResponse implements HttpResponse {
  constructor(private response: http.ServerResponse) { }

  public end() {
    this.response.end();
  }

  public getStatus() {
    return this.response.statusCode;
  }

  public setStatus(code: HttpStatusCode) {
    this.response.statusCode = code;
    this.response.statusMessage = HttpReasonPhraseMap[code];
  }

  public getHeader(name: HttpResponseHeaderName) {
    return <any>this.response.getHeader(name);
  }

  public setHeader(name: HttpResponseHeaderName, value: string) {
    this.response.setHeader(name, value);
  }

  public text(text: string) {
    this.response.setHeader('Content-Type', 'text/plain');
    this.response.write(text);
  }

  public json<T>(data: T) {
    this.response.setHeader('Content-Type', 'application/json');
    this.response.write(JSON.stringify(data));
  }
}
