import { Subscription } from 'rxjs';
import { HttpRequest, HttpMethod, HttpRequestHeadersObject } from '../core/request';
import { TcpSocket } from './tcp-server';

export class CustomHttpRequest implements HttpRequest {
  method: HttpMethod;
  uri: string;
  httpVersion: string;
  headers: HttpRequestHeadersObject;
  body: string;

  private rawData = '';
  private headLoaded = false;
  constructor(
    private client: TcpSocket
  ) {
  }

  async readBody(): Promise<void> {
    let suscription: Subscription;
    await new Promise((resolve, reject) => {
      suscription = this.client.data$.subscribe(data => {
        this.rawData = this.rawData.concat(this.ab2trs(data));

        const parts = this.rawData.split(/\r?\n\r?\n/);
        if (!this.headLoaded && parts.length === 2) {
          this.loadHead(parts[0]);
          this.body = parts[1];
        }

        if (this.headLoaded) {
          if (this.shouldHaveBody()) {
            if (this.bodyCompleted()) {
              resolve();
            }
          } else {
            resolve();
          }
        }
      });
    });
    suscription.unsubscribe();
  }

  private shouldHaveBody() {
    return this.method === 'POST' || this.method === 'PUT';
  }

  private bodyCompleted() {
    return Buffer.byteLength(this.body, 'utf8') === parseInt(this.headers['content-length'], 10);
  }

  private loadHead(head: string) {
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

    this.headLoaded = true;
  }

  private ab2trs(data: ArrayBuffer): string {
    return String.fromCharCode.apply(null, new Uint8Array(data));
  }
}