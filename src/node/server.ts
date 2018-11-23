import * as http from 'http';

import { HttpRequestHandler, HttpServer } from '../core/server';
import { NodeHttpRequest } from './request';
import { NodeHttpResponse } from './response';

/**
 * Node http server implementation
 */
export class NodeHttpServer implements HttpServer {
  private server: http.Server;

  constructor(
    private requestHandler: HttpRequestHandler
  ) {
    this.server = http.createServer(async (request, response) => {
      try {
        const httpRequest = new NodeHttpRequest(request);
        const httpResponse = new NodeHttpResponse(response);

        await httpRequest.readBody();
        this.requestHandler(httpRequest, httpResponse);
      } catch (error) {
        throw error;
      }
    });
  }

  public listen(port: number) {
    return new Promise<void>(resolve => this.server.listen(port, resolve));
  }

  public stop() {
    return new Promise<void>(resolve => this.server.close(resolve));
  }
}
