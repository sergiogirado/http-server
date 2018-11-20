import * as net from 'net';
import { Subject } from 'rxjs';
import { TcpSocket } from '../custom/tcp-server';

export class NodeTcpSocket implements TcpSocket {

  data$ = new Subject<ArrayBuffer>();

  constructor(private socket: net.Socket) {
    this.socket.on('data', data => {
      const ab = new ArrayBuffer(data.length);
      const view = new Uint8Array(ab);
      for (let i = 0; i < data.length; ++i) {
        view[i] = data[i];
      }
      this.data$.next(ab);
    });
  }

  send(data: ArrayBuffer): Promise<void> {
    return new Promise(resolve => {
      let buffer = new Buffer(data.byteLength);
      let view = new Uint8Array(data);
      for (var i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
      }
      this.socket.end(buffer, resolve);
    });
  }
}
