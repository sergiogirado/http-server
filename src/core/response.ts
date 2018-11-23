import { HttpEntitySpecificHeaders, HttpGeneralHeaders } from './headers';

/**
 * Http response abstraction
 */
export interface HttpResponse {
  end(): void;
  getStatus(): number;
  setStatus(code: HttpStatusCode): void;
  getHeader(name: HttpResponseHeaderName): string;
  setHeader(name: HttpResponseHeaderName, value: string): void;
  text(text: string): void;
  json<T>(data: T): void;
}

export type HttpInformationalStatusCode = 100 | 101;
export type HttpSuccessStatusCode = 200 | 201 | 202 | 203 | 204 | 205 | 206;
export type HttpRedirectionStatusCode = 300 | 301 | 302 | 303 | 304 | 305 | 307;
export type HttpClientErrorStatusCode = 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417; // tslint:disable-line:max-line-length
export type HttpServerErrorStatusCode = 500 | 501 | 502 | 503 | 504 | 505;

export type HttpStatusCode = HttpInformationalStatusCode | HttpSuccessStatusCode | HttpRedirectionStatusCode | HttpClientErrorStatusCode | HttpServerErrorStatusCode; // tslint:disable-line:max-line-length

export const HttpReasonPhraseMap = { // tslint:disable-line:variable-name
  100: 'Continue',
  101: 'Switching Protocols',
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See Other',
  304: 'Not Modified',
  305: 'Use Proxy',
  307: 'Temporary Redirect',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Time-out',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Request Entity Too Large',
  414: 'Request-URI Too Large',
  415: 'Unsupported Media Type',
  416: 'Requested range not satisfiable',
  417: 'Expectation Failed',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Time-out',
  505: 'HTTP Version not supported'
};

export interface HttpResponseSpecificHeaders {
  'Accept-Ranges'?: string;
  'Age'?: string;
  'ETag'?: string;
  'Location'?: string;
  'Proxy-Authenticate'?: string;
  'Retry-After'?: string;
  'Server'?: string;
  'Vary'?: string;
  'WWW-Authenticate'?: string;
}

export type HttpResponseHeadersObject = HttpGeneralHeaders & HttpResponseSpecificHeaders & HttpEntitySpecificHeaders;
export type HttpResponseHeaderName = keyof HttpResponseHeadersObject;
