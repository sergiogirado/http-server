import { HttpEntitySpecificHeaders, HttpGeneralHeaders } from './headers';

/**
 * Htp request abstraction
 */
export interface HttpRequest {
  method: HttpMethod;
  uri: HttpUri;
  httpVersion: string;
  headers: HttpRequestHeadersObject;
  body: string;
  readBody(): Promise<void>;
}

export class HttpUri {
  public path: string;
  public queryParams: { [key: string]: string | string[] };

  constructor(readonly raw: string) {
    const [path, query] = this.raw.split('?');
    this.path = path;
    this.queryParams = this.getQueryParams(query);
  }

  private getQueryParams(query: string) {
    return query
      .split('&')
      .map(queryItem => decodeURI(queryItem).split('='))
      .reduce<{ [key: string]: string | string[] }>((prev, [key, value]) => {
        if (prev[key]) {
          if (prev[key] instanceof Array) {
            (<string[]>prev[key]).push(value);
          } else {
            prev[key] = [<string>prev[key], value];
          }
        } else {
          prev[key] = value;
        }

        return prev;
      }, {}); // tslint:disable-line:align
  }
}

/**
 * Http standard methods
 */
export type HttpMethod =
  | 'OPTIONS'
  | 'GET'
  | 'HEAD'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'TRACE'
  | 'CONNECT';

/**
 * Http request headers
 */
export interface HttpRequestSpecificHeaders {
  'Accept'?: string;
  'Accept-Charset'?: string;
  'Accept-Encoding'?: string;
  'Accept-Language'?: string;
  'Authorization'?: string;
  'Expect'?: string;
  'From'?: string;
  'Host'?: string;
  'If-Match'?: string;
  'If-Modified-Since'?: string;
  'If-None-Match'?: string;
  'If-Range'?: string;
  'If-Unmodified-Since'?: string;
  'Max-Forwards'?: string;
  'Proxy-Authorization'?: string;
  'Range'?: string;
  'Referer'?: string;
  'TE'?: string;
  'User-Agent'?: string;
}

export type HttpRequestHeadersObject = HttpGeneralHeaders & HttpRequestSpecificHeaders & HttpEntitySpecificHeaders;
export type HttpRequestHeaderName = keyof HttpRequestHeadersObject;
