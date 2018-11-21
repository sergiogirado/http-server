import { HttpResponse, HttpStatusCode, HttpResponseHeadersObject, HttpResponseHeaderName, HttpReasonPhraseMap } from '../core/response';
import { TcpSocket } from './tcp-server';

export class CustomHttpResponse implements HttpResponse {
  private httpVersion: string = 'HTTP/1.1';
  private statusCode: HttpStatusCode = 200;
  private reasonPhrase: string = HttpReasonPhraseMap[200];
  private headers: HttpResponseHeadersObject = {};
  private body: string = '';

  constructor(
    private client: TcpSocket
  ) { }

  end() {
    const buffer = this.encode(this.toString());
    this.client.send(buffer);
  }

  getStatus() {
    return this.statusCode;
  }

  setStatus(code: HttpStatusCode) {
    this.statusCode = code;
    this.reasonPhrase = HttpReasonPhraseMap[code] || '';
  }

  setHeader(name: HttpResponseHeaderName, value: string) {
    if (value === null) {
      delete this.headers[name];
    } else {
      this.headers[name] = value;
    }
  }

  getHeader(name: HttpResponseHeaderName) {
    return this.headers[<string>name];
  }

  text(text: string) {
    this.setHeader('Content-Type', 'text/plain');
    this.body = text;
  }

  json<T>(data: T) {
    this.setHeader('Content-Type', 'application/json');
    this.body = JSON.stringify(data);
  }

  toString() {
    const statusLine = `${this.httpVersion} ${this.statusCode} ${this.reasonPhrase}`;
    const headers = Object.keys(this.headers).map(name => `${name}: ${this.headers[name]}`);
    const body = this.body;
    const lines = [
      statusLine,
      ...headers,
      '',
      body
    ];
    return lines.join('\n');
  }

  private encode(str: string) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    const strLen = str.length;
    for (let i = 0; i < strLen; i += 1) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }
}

