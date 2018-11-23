import 'reflect-metadata'; // tslint:disable-line:no-import-side-effect

import { HttpMiddlewareFunction } from './app';
import { HttpMethod } from './request';
import { HttpStatusCode } from './response';

/**
 * Middleware to handle request using simple APIs definitions
 */
export class ApiMiddleware {
  public onRequest: HttpMiddlewareFunction;
  constructor(
    private controllers: { [key: string]: any }[],
    private apiManager: ApiManager = DefaultApiManager.instance
  ) {
    this.onRequest = this.onRequestFn.bind(this);
  }

  private onRequestFn: HttpMiddlewareFunction = async (request, response, next) => {
    for (const controller of this.controllers) {
      const prefix = `/${this.apiManager.getHttpRoutePrefix(controller.constructor)}`;
      if (!request.uri.raw.startsWith(prefix)) {
        continue;
      }

      const decoratedMethods = this.apiManager.getDecoratedMethods(controller);
      for (const decoratedMethodName of decoratedMethods) {
        const httpMethod = this.apiManager.getHttpMethod(controller, decoratedMethodName);
        const url = `${prefix}/${httpMethod.path}`;

        if (request.uri.raw === url && request.method === httpMethod.method) {
          try {
            const result = await controller[decoratedMethodName](request.body);
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

function HttpCustom(method: HttpMethod, path: string) { // tslint:disable-line:function-name
  return (target: { [key: string]: any }, propertyKey: string) => {
    DefaultApiManager.instance.setHttpMethod(target, propertyKey, { method, path });
  };
}

export function HttpRoutePrefix(prefix: string) { // tslint:disable-line:function-name
  return (target: Function) => {
    DefaultApiManager.instance.setHttpRoutePrefix(target, prefix);
  };
}

export function HttpGet(path: string) { // tslint:disable-line:function-name
  return HttpCustom('GET', path);
}

export function HttpPost(path: string) { // tslint:disable-line:function-name
  return HttpCustom('POST', path);
}

export function HttpPut(path: string) { // tslint:disable-line:function-name
  return HttpCustom('PUT', path);
}

export function HttpDelete(path: string) { // tslint:disable-line:function-name
  return HttpCustom('DELETE', path);
}

type httpMethodType = {
  method: HttpMethod;
  path: string;
};

export interface ApiManager {
  getHttpMethod(target: any, propertyKey: string): httpMethodType;
  setHttpMethod(target: any, propertyKey: string, value: httpMethodType): void;

  getHttpRoutePrefix(target: any): string;
  setHttpRoutePrefix(target: any, value: string): void;

  setDecoratedMethods(obj: { [key: string]: any }, methods: string[]): void;
  getDecoratedMethods(obj: { [key: string]: any }): string[];
}

export class DefaultApiManager implements ApiManager {
  public static instance = new DefaultApiManager();

  private static httpEndpointKey = Symbol('HTTP_ENDPOINT');
  private static httpMethodsKey = Symbol('HTTP_METHODS');
  private static httpRoutePrefixKey = Symbol('HTTP_ROUTE_PREFIX');

  private constructor() { }

  public getHttpMethod(target: any, propertyKey: string): httpMethodType {
    return Reflect.getMetadata(DefaultApiManager.httpEndpointKey, target, propertyKey);
  }
  public setHttpMethod(target: any, propertyKey: string, value: httpMethodType): void {
    const registeredMethods = DefaultApiManager.instance.getDecoratedMethods(target) || [];
    DefaultApiManager.instance.setDecoratedMethods(target, [...registeredMethods, propertyKey]);
    Reflect.metadata(DefaultApiManager.httpEndpointKey, value)(target, propertyKey);
  }

  public getHttpRoutePrefix(target: any): string {
    return Reflect.getMetadata(DefaultApiManager.httpRoutePrefixKey, target);
  }
  public setHttpRoutePrefix(target: any, value: string): void {
    Reflect.metadata(DefaultApiManager.httpRoutePrefixKey, value)(target);
  }

  public setDecoratedMethods(target: { [key: string]: any }, value: string[]): void {
    Reflect.metadata(DefaultApiManager.httpMethodsKey, value)(<any>target);
  }
  public getDecoratedMethods(target: { [key: string]: any }): string[] {
    return Reflect.getMetadata(DefaultApiManager.httpMethodsKey, target);
  }
}
