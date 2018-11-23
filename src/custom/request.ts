import { Subscription } from 'rxjs';
import { HttpMethod, HttpRequest, HttpRequestHeadersObject, HttpUri } from '../core/request';
import { TcpSocket } from './tcp-server';

/**
 * Custom implementation of Http Request
 */
export class CustomHttpRequest implements HttpRequest {
  public method: HttpMethod;
  public uri: HttpUri;
  public httpVersion: string;
  public headers: HttpRequestHeadersObject;
  public body: string;

  private rawData = '';
  private headLoaded = false;
  constructor(
    private client: TcpSocket
  ) {
  }

  public async readBody(): Promise<void> {
    let suscription: Subscription;

    await new Promise((resolve, reject) => { // tslint:disable-line:promise-must-complete
      suscription = this.client.data$.subscribe(data => {
        this.rawData = this.rawData.concat(this.ab2trs(data));

        if (!this.headLoaded) {
          const parts = this.rawData.split(/\r?\n\r?\n/);
          if (parts.length === 2) {
            this.loadHead(parts[0]);
            this.rawData = parts[1];
          }
        }

        if (this.headLoaded) {
          if (this.shouldHaveBody()) {
            if (this.dataLengthMatch(this.rawData)) {
              this.body = this.rawData;
              resolve();
            }
          } else {
            this.body = '';
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

  private dataLengthMatch(data: string) {
    return Buffer.byteLength(data, 'utf8') === parseInt(this.headers['Content-Length'], 10);
  }

  private loadHead(head: string) {
    const headLines = head.split(/\r?\n/);
    const requestLine = headLines.shift();
    const [method, uri, httpVersion] = requestLine.split(' ');
    const headers = headLines.reduce<HttpRequestHeadersObject>((previous, line) => {
      const index = line.indexOf(':');
      const key = line.substring(0, index);
      const value = line.substring(index + 2, line.length);
      const current: HttpRequestHeadersObject = {};
      (<any>current)[key] = value;

      return { ...previous, ...current };
    }, {}); // tslint:disable-line:align

    this.method = <HttpMethod>method;
    this.uri = new HttpUri(uri);
    this.httpVersion = httpVersion;
    this.headers = headers;

    this.headLoaded = true;
  }

  private ab2trs(data: ArrayBuffer): string {
    return String.fromCharCode.apply(null, new Uint8Array(data));
  }
}
