import 'reflect-metadata';

import { HttpMethod } from './request';
import { HttpMiddlewareFunction } from './app';
import { HttpStatusCode } from './response';

export class ApiMiddleware {
  onRequest: HttpMiddlewareFunction;
  constructor(
    private controllers: { [key: string]: any }[],
    private apiManager: ApiManager = DefaultApiManager.instance
  ) {
    this.onRequest = this._onRequest.bind(this);
  }

  private _onRequest: HttpMiddlewareFunction = async (request, response, next) => {
    for (const controller of this.controllers) {
      const prefix = `/${this.apiManager.getHttpRoutePrefix(controller.constructor)}`;
      if (!request.uri.startsWith(prefix)) {
        continue;
      }

      const functions = this.apiManager.getDecoratedMethodsOf(controller);
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

const httpMethodKey = Symbol('HTTP_METHOD');
const httpRoutePrefixKey = Symbol('HTTP_ROUTE_PREFIX');

type httpMethodType = { method: HttpMethod, path: string };

function HttpCustom(method: HttpMethod, path: string) {
  return (target: { [key: string]: any }, propertyKey: string) => {
    DefaultApiManager.instance.appendDecoratedMethod(target, propertyKey);
    const reflect = Reflect.metadata(httpMethodKey, <httpMethodType>{ method, path });
    reflect(target, propertyKey);
  };
}

export function HttpRoutePrefix(prefix: string) {
  return Reflect.metadata(httpRoutePrefixKey, prefix);
}

export function HttpGet(path: string) {
  return HttpCustom('GET', path);
}

export function HttpPost(path: string) {
  return HttpCustom('POST', path);
}

export function HttpPut(path: string) {
  return HttpCustom('PUT', path);
}

export function HttpDelete(path: string) {
  return HttpCustom('DELETE', path);
}

export interface ApiManager {
  getHttpMethod(target: any, propertyKey: string): httpMethodType;
  getHttpRoutePrefix(target: any): string;

  appendDecoratedMethod(get: { [key: string]: any }, propertyKey: string): void;
  getDecoratedMethodsOf(obj: { [key: string]: any }): string[];
}

export class DefaultApiManager implements ApiManager {
  public static instance = new DefaultApiManager();
  private methodsAttribute = 'HTTP_CONTROLLER_METHODS';

  private constructor() { }

  appendDecoratedMethod(target: { [key: string]: any }, propertyKey: string): void {
    if (!target[this.methodsAttribute]) {
      target[this.methodsAttribute] = [];
    }
    target[this.methodsAttribute].push(propertyKey);
  }

  getDecoratedMethodsOf(obj: { [key: string]: any; }): string[] {
    return obj[this.methodsAttribute];
  }

  getHttpRoutePrefix(target: any): string {
    return Reflect.getMetadata(httpRoutePrefixKey, target);
  }

  getHttpMethod(target: any, propertyKey: string) {
    return Reflect.getMetadata(httpMethodKey, target, propertyKey);
  }
}
