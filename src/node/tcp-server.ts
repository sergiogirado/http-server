import * as net from 'net';
import { Subject } from 'rxjs';
import { TcpServer, TcpSocket } from '../custom/tcp-server';
import { NodeTcpSocket } from './tcp-socket';

/**
 * Node tcp server implementation
 */
export class NodeTcpServer implements TcpServer {
  public connections$ = new Subject<TcpSocket>();

  private server: net.Server;

  constructor() {
    this.server = net.createServer(socket => {
      this.connections$.next(new NodeTcpSocket(socket));
    });
  }

  public listen(port: number): Promise<void> {
    return new Promise(resolve => this.server.listen(port, resolve));
  }

  public stop(): Promise<void> {
    return new Promise(resolve => this.server.close(resolve));
  }
}
