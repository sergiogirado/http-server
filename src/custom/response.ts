import { HttpResponse, HttpStatusCode, HttpResponseHeadersObject, HttpResponseHeaderName, HttpReasonPhraseMap } from '../core/response';
import { TcpServer } from './tcp-server';

export class CustomHttpResponse implements HttpResponse {
  private data: HttpResponseData = {
    httpVersion: 'HTTP/1.1',
    statusCode: 200,
    reasonPhrase: HttpReasonPhraseMap[200],
    headers: {},
    body: ''
  };

  constructor(
    private tcpServer: TcpServer,
    private clientSocketId: number
  ) { }

  end() {
    const buffer = this.encode(this.toString());
    this.tcpServer.send(this.clientSocketId, buffer);
  }

  getStatus() {
    return this.data.statusCode;
  }

  setStatus(code: HttpStatusCode) {
    this.data.statusCode = code;
    this.data.reasonPhrase = HttpReasonPhraseMap[code] || '';
  }

  setHeader(name: HttpResponseHeaderName, value: string) {
    if (value === null) {
      delete this.data.headers[name];
    } else {
      this.data.headers[name] = value;
    }
  }
  
  getHeader(name: HttpResponseHeaderName) {
    return this.data.headers[<string>name];
  }

  text(text: string) {
    this.setHeader('Content-Type', 'text/plain');
    this.data.body = text;
  }

  json<T>(data: T) {
    this.setHeader('Content-Type', 'application/json');
    this.data.body = JSON.stringify(data);
  }

  toString() {
    const statusLine = `${this.data.httpVersion} ${this.data.statusCode} ${this.data.reasonPhrase}`;
    const headers = Object.keys(this.data.headers).map(name => `${name}: ${this.data.headers[name]}`);
    const body = this.data.body;
    const lines = [
      statusLine,
      headers,
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

export interface HttpResponseData {
  httpVersion: string;
  statusCode: HttpStatusCode;
  reasonPhrase: string;
  headers: HttpResponseHeadersObject;
  body: string;
}
