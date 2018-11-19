import { HttpRequest } from './request';
import { HttpResponse } from './response';

export interface HttpServer {
    listen(port: number): Promise<void>;
    stop(): Promise<void>;
}

export interface HttpServerFactory {
    createServer(requestHandler: HttpRequestHandler): Promise<HttpServer>;
}

export type HttpRequestHandler = (request: HttpRequest, response: HttpResponse) => void;