import * as net from 'net';
import { Subject } from 'rxjs';
import { TcpSocket } from '../custom/tcp-server';

/**
 * Node tcp socket implementation
 */
export class NodeTcpSocket implements TcpSocket {

  public data$ = new Subject<ArrayBuffer>();

  constructor(private socket: net.Socket) {
    this.socket.on('data', data => {
      const ab = new ArrayBuffer(data.length);
      const view = new Uint8Array(ab);
      data.forEach((value, index) => view[index] = value);

      this.data$.next(ab);
    });
  }

  public send(data: ArrayBuffer): Promise<void> {
    return new Promise(resolve => {
      const buffer = new Buffer(data.byteLength);
      const view = new Uint8Array(data);
      view.forEach((value, index) => buffer[index] = value);

      this.socket.end(buffer, resolve);
    });
  }
}
