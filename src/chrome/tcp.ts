import { Tcp, TcpSocket } from '../custom/tcp-server';
import { ChromeTcpSocket } from './tcp-socket';

/**
 * @example
 * 
 ```typescript
const tcp = new ChromeTcp();
tcp
 .connect('', 2700)
 .then(socket => {
   socket.send(null);
 });
```
 */
export class ChromeTcp implements Tcp {

  private socketId: number;

  connect(host: string, port: number): Promise<TcpSocket> {
    return new Promise((resolve, reject) => {
      chrome.sockets.tcp.create({}, createInfo => {
        this.socketId = createInfo.socketId;

        chrome.sockets.tcp.connect(createInfo.socketId, host, port, info => {
          if (info >= 0) {
            resolve(new ChromeTcpSocket(createInfo.socketId));
          } else {
            reject(info);
          }
        });
      });
    });
  }

  disconnect(): Promise<void> {
    return new Promise(resolve => chrome.sockets.tcp.disconnect(this.socketId, resolve));
  }
}
