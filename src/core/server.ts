import { HttpRequest } from './request';
import { HttpResponse } from './response';

/**
 * Http server abstraction
 */
export interface HttpServer {
  listen(port: number): Promise<void>;
  stop(): Promise<void>;
}

/**
 * Http server factory abstraction
 */
export interface HttpServerFactory {
  createServer(requestHandler: HttpRequestHandler): Promise<HttpServer>;
}

/**
 * Method to handle a request
 */
export type HttpRequestHandler = (request: HttpRequest, response: HttpResponse) => void;
