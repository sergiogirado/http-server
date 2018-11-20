import { Subscription } from 'rxjs';
import { HttpRequest, HttpMethod, HttpRequestHeadersObject } from '../core/request';
import { TcpServer } from './tcp-server';

export class CustomHttpRequest implements HttpRequest {
  method: HttpMethod;
  uri: string;
  httpVersion: string;
  headers: HttpRequestHeadersObject;
  body: string;

  private partialBody: string;
  constructor(
    private tcpSocket: TcpServer,
    private clientSocketId: number,
    initialData: ArrayBuffer
  ) {
    const data = this.ab2trs(initialData);
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

    this.method = <HttpMethod>method;
    this.uri = uri;
    this.httpVersion = httpVersion;
    this.headers = headers;
    this.partialBody = body;
  }

  async readBody(): Promise<void> {
    let suscription: Subscription;
    await new Promise((resolve, reject) => {
      suscription = this.tcpSocket.messages$.subscribe(data => {
        if (data.clientSocketId === this.clientSocketId) {
          this.partialBody.concat(this.ab2trs(data.data));
          if (Buffer.byteLength(this.partialBody, 'utf8') === parseInt(this.headers['content-length'], 10)) {
            resolve();
          }
        }
      });
    });
    suscription.unsubscribe();
  }

  private ab2trs(data: ArrayBuffer): string {
    return String.fromCharCode.apply(null, new Uint8Array(data));
  }
}