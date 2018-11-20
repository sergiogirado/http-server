import { Subject } from 'rxjs';

import { TcpSocket } from '../custom/tcp-server';

export class ChromeTcpSocket implements TcpSocket {
  data$ = new Subject<ArrayBuffer>();

  private onReceiveFn = this.onReceive.bind(this);

  constructor(private clientSocketId: number, initialData?: ArrayBuffer) {
    chrome.sockets.tcp.onReceive.addListener(this.onReceiveFn);
    if (initialData) setTimeout(() => this.data$.next(initialData));
  }

  send(data: ArrayBuffer): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.sockets.tcp.send(this.clientSocketId, data, sendInfo => {
        if (sendInfo.resultCode >= 0) {
          resolve();
        } else {
          reject(sendInfo.resultCode);
        }
      });
    });
  }

  dispose() {
    chrome.sockets.tcp.onReceive.removeListener(this.onReceiveFn);
  }

  private onReceive(recvInfo: chrome.sockets.ReceiveEventArgs) {
    if (recvInfo.socketId != this.clientSocketId) { return; }
    this.data$.next(recvInfo.data);
  }
}
