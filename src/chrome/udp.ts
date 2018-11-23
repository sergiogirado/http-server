import { Subject } from 'rxjs';

import { Udp } from '../custom/tcp-server';

/**
 * @example
 ```
const udp = new ChromeUdp();
udp
  .data$
  .subscribe(data => {
    console.log('Received data: ', data);
  });

udp.listen(3001);
udp.send(null, '127.0.0.1', 3001);
 ```
 */
export class ChromeUdp implements Udp {
  public data$ = new Subject<ArrayBuffer>();

  private onReceiveFn = this.onReceive.bind(this);
  private socketId: number;

  constructor() {
    chrome.sockets.udp.create({}, socketInfo => this.socketId = socketInfo.socketId);
  }

  public send(data: ArrayBuffer, host: string, port: number): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.sockets.udp.send(this.socketId, data, host, port, sendInfo => {
        if (sendInfo.resultCode >= 0) {
          resolve();
        } else {
          reject(sendInfo.resultCode);
        }
      });
    });
  }

  public listen(port: number = 0): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.sockets.udp.onReceive.addListener(this.onReceiveFn);
      chrome.sockets.udp.bind(this.socketId, '0.0.0.0', port, result => {
        if (result >= 0) {
          resolve();
        } else {
          reject();
        }
      });
    });
  }

  private onReceive(info: chrome.sockets.ReceiveEventArgs) {
    if (info.socketId !== this.socketId) { return; }
    this.data$.next(info.data);
  }
}
