import { HttpGeneralHeaders, HttpEntitySpecificHeaders, HttpGenericHeadersObject } from './headers';

export interface HttpRequest {
    method: HttpMethod;
    uri: string;
    httpVersion: string;
    headers: HttpRequestHeadersObject;
    body: string;
}

export type HttpMethod =
    | 'OPTIONS'
    | 'GET'
    | 'HEAD'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'TRACE'
    | 'CONNECT';

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

export type HttpRequestHeadersObject = HttpGeneralHeaders & HttpRequestSpecificHeaders & HttpEntitySpecificHeaders & HttpGenericHeadersObject;
export type HttpRequestHeaderName = keyof (HttpGeneralHeaders & HttpRequestSpecificHeaders & HttpEntitySpecificHeaders);