import * as net from 'net';
import { Subject } from 'rxjs';
import { TcpServer, TcpSocket } from '../custom/tcp-server';
import { NodeTcpSocket } from './tcp-socket';

export class NodeTcpServer implements TcpServer {
  connections$ = new Subject<TcpSocket>();

  private server: net.Server;

  constructor() {
    this.server = net.createServer(socket => {
      this.connections$.next(new NodeTcpSocket(socket));
    });
  }

  listen(port: number): Promise<void> {
    this.server.listen(port);
    return Promise.resolve();
  }

  stop(): Promise<void> {
    this.server.close();
    return Promise.resolve();
  }
}
