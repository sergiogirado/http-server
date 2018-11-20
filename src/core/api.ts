import 'reflect-metadata';
import { HttpMethod } from './request';
import { HttpMiddlewareFunction } from './app';
import { HttpStatusCode } from './response';

export class ApiMiddleware {
    onRequest: HttpMiddlewareFunction;
    constructor(
        private controllers: { [key: string]: any }[],
        private apiManager = defaultApiManager
    ) {
        this.onRequest = this._onRequest.bind(this);
     }

    private _onRequest: HttpMiddlewareFunction = async (request, response, next) => {
        for (const controller of this.controllers) {
            const prefix = `/${this.apiManager.getHttpController(controller.constructor)}`;
            if (!request.uri.startsWith(prefix)) {
                continue;
            }

            const functions = this.apiManager.getFunctionsOf(controller);
            for (const functionName of functions) {
                const httpMethod = this.apiManager.getHttpMethod(controller, functionName);
                const url = `${prefix}/${httpMethod.path}`;

                if (request.uri === url && request.method === httpMethod.method) {
                    try {
                        const result = await controller[functionName](request.body);
                        if (result) {
                            response.setStatus(200);
                            response.json(result);
                        } else {
                            response.setStatus(204);
                        }
                    } catch (error) {
                        if (error instanceof HTTPError) {
                            response.setStatus(error.statusCode);
                            response.json(error.details);
                        } else {
                            response.setStatus(500);
                            response.json(error);
                        }
                    }
                    response.end();
                    return;
                }
            }
        }
        next();
    }
}

export class HTTPError {
    constructor(
        public readonly statusCode: HttpStatusCode,
        public readonly details: any
    ) { }
}

const methodsAttribute = 'HTTP_CONTROLLER_METHODS';
const httpMethodKey = Symbol('HTTP_METHOD');
const httpRoutePrefixKey = Symbol('HTTP_ROUTE_PREFIX');

type httpMethodType = { method: HttpMethod, path: string };

function HttpGeneric(method: HttpMethod, path: string) {
    return (target: { [key: string]: any }, propertyKey: string | symbol) => {
        if (!target[methodsAttribute]) {
            target[methodsAttribute] = [];
        }
        target[methodsAttribute].push(propertyKey);
        const reflect = Reflect.metadata(httpMethodKey, <httpMethodType>{ method, path });
        reflect(target, propertyKey);
    };
}

export function HttpRoutePrefix(prefix: string) {
    return Reflect.metadata(httpRoutePrefixKey, prefix);
}

export function HttpGet(path: string) {
    return HttpGeneric('GET', path);
}

export function HttpPost(path: string) {
    return HttpGeneric('POST', path);
}

export function HttpPut(path: string) {
    return HttpGeneric('PUT', path);
}

export function HttpDelete(path: string) {
    return HttpGeneric('DELETE', path);
}

export interface ApiManager {
    getHttpMethod(target: any, propertyKey: string): httpMethodType;
    getHttpController(target: any): string;
    getFunctionsOf(obj: { [key: string]: any }): string[];
}

export const defaultApiManager: ApiManager = {
    getHttpMethod: (target, propertyKey) => Reflect.getMetadata(httpMethodKey, target, propertyKey),
    getHttpController: target => Reflect.getMetadata(httpRoutePrefixKey, target),
    getFunctionsOf: obj => obj[methodsAttribute]
}
