export interface HttpGeneralHeaders {
    'Cache-Control'?: string;
    'Connection'?: string;
    'Date'?: string;
    'Pragma'?: string;
    'Trailer'?: string;
    'Transfer-Encoding'?: string;
    'Upgrade'?: string;
    'Via'?: string;
    'Warning'?: string;
}

export interface HttpEntitySpecificHeaders {
    'Allow'?: string;
    'Content-Encoding'?: string;
    'Content-Language'?: string;
    'Content-Length'?: string;
    'Content-Location'?: string;
    'Content-MD5'?: string;
    'Content-Range'?: string;
    'Content-Type'?: string;
    'Expires'?: string;
    'Last-Modified'?: string;
}

export type HttpGenericHeadersObject = { [name: string]: string };
