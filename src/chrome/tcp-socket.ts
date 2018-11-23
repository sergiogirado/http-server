import { BehaviorSubject, Subject } from 'rxjs';

import { TcpSocket } from '../custom/tcp-server';

/**
 * Tcp Socket implementation for Chrome Apps plugin
 */
export class ChromeTcpSocket implements TcpSocket {
  public data$: Subject<ArrayBuffer>;

  private onReceiveFn = this.onReceive.bind(this);

  constructor(private clientSocketId: number, initialData?: ArrayBuffer) {
    chrome.sockets.tcp.onReceive.addListener(this.onReceiveFn);
    if (initialData) {
      this.data$ = new BehaviorSubject<ArrayBuffer>(initialData);
    } else {
      this.data$ = new Subject<ArrayBuffer>();
    }
  }

  public send(data: ArrayBuffer): Promise<void> {
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

  public dispose() {
    chrome.sockets.tcp.onReceive.removeListener(this.onReceiveFn);
  }

  private onReceive(recvInfo: chrome.sockets.ReceiveEventArgs) {
    if (recvInfo.socketId !== this.clientSocketId) { return; }
    this.data$.next(recvInfo.data);
  }
}
