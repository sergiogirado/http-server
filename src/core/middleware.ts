import { HttpRequest } from './request';
import { HttpResponse } from './response';

export type HttpMiddlewareFunction = (request: HttpRequest, reponse: HttpResponse, next: () => void) => void;

export interface HttpMiddleware {
    handleRequest: HttpMiddlewareFunction;
}
