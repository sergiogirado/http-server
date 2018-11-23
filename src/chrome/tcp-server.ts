import { Subject } from 'rxjs';

import { TcpServer, TcpSocket } from '../custom/tcp-server';
import { ChromeTcpSocket } from './tcp-socket';

/**
 * @example
 *
```
const tcpServer = new ChromeTcpServer();
tcpServer
  .connections$
  .subscribe(client => {
    client.send(null);
    client.data$.subscribe(data => {
      console.log('Data received', data);
    });
  });
```
 */
export class ChromeTcpServer implements TcpServer {
  public connections$ = new Subject<TcpSocket>();

  private serverSocketId: number;
  private clients: { [clientSocketId: number]: ChromeTcpSocket } = {};
  private onAcceptFn = this.onAccept.bind(this);

  constructor() {
    chrome.sockets.tcpServer.create({}, createInfo => this.serverSocketId = createInfo.socketId);
  }

  public listen(port: number): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.sockets.tcpServer.listen(this.serverSocketId, '0.0.0.0', port, resultCode => {
        if (resultCode >= 0) {
          chrome.sockets.tcpServer.onAccept.addListener(this.onAcceptFn);
          chrome.sockets.tcpServer.onAcceptError.addListener(this.onAcceptFn);
          resolve();
        } else {
          reject(resultCode);
        }
      });
    });
  }

  public stop(): Promise<void> {
    return new Promise(resolve => {
      chrome.sockets.tcpServer.onAccept.removeListener(this.onAcceptFn);
      chrome.sockets.tcpServer.disconnect(this.serverSocketId, resolve);
    });
  }

  private onAccept(info: chrome.sockets.AcceptEventArgs): void {
    if (info.socketId !== this.serverSocketId) { return; }

    chrome.sockets.tcp.onReceive.addListener(recvInfo => {
      if (!this.clients[recvInfo.socketId]) {
        this.clients[recvInfo.socketId] = new ChromeTcpSocket(recvInfo.socketId, recvInfo.data);
        this.connections$.next(this.clients[recvInfo.socketId]);
      }
    });
    chrome.sockets.tcp.setPaused(info.socketId, false);
  }
}
