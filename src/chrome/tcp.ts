import { Tcp, TcpSocket } from '../custom/tcp-server';
import { ChromeTcpSocket } from './tcp-socket';

/**
 * @example
 ```
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

  private create = new Promise((resolve, reject) => {
    chrome.sockets.tcp.create({}, createInfo => {
      this.socketId = createInfo.socketId;
      resolve();
    });
  });

  public async connect(host: string, port: number): Promise<TcpSocket> {
    let result: TcpSocket;
    await this.create;
    result = await new Promise<ChromeTcpSocket>((resolve, reject) => {
      chrome.sockets.tcp.connect(this.socketId, host, port, info => {
        if (info >= 0) {
          resolve(new ChromeTcpSocket(this.socketId));
        } else {
          reject(info);
        }
      });
    });

    return result;
  }

  public disconnect(): Promise<void> {
    return new Promise(resolve => chrome.sockets.tcp.disconnect(this.socketId, resolve));
  }
}
