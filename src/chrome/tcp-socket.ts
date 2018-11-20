import { Subject } from 'rxjs';

import { TcpSocket, TcpReceivedData } from '../generic/tcp';

export class ChromeTcpSocket implements TcpSocket {
    messages$: Subject<TcpReceivedData>;

    private serverSocketId: number;
    private onAcceptFn = this.onAccept.bind(this);
    constructor() {
        chrome.sockets.tcpServer.create({}, createInfo => this.serverSocketId = createInfo.socketId);
    }

    send(clientSocketId: number, data: ArrayBuffer): Promise<number> {
        return new Promise((resolve, reject) => {
            chrome.sockets.tcp.send(clientSocketId, data, sendInfo => {
                if (sendInfo.resultCode >= 0) {
                    resolve(sendInfo.bytesSent);
                } else {
                    reject(sendInfo.resultCode);
                }
            });
        });
    }

    listen(port: number): Promise<void> {
        return new Promise((resolve, reject) => {
            const ip = '0.0.0.0';
            chrome.sockets.tcpServer.listen(this.serverSocketId, ip, port, resultCode => {
                if (resultCode >= 0) {
                    chrome.sockets.tcpServer.onAccept.addListener(this.onAcceptFn);
                    resolve();
                } else {
                    reject(resultCode);
                }
            });
        });
    }

    stop(): Promise<void> {
        try {
            chrome.sockets.tcpServer.onAccept.removeListener(this.onAcceptFn);
            chrome.sockets.tcpServer.disconnect(this.serverSocketId);
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    private onAccept(info: chrome.sockets.AcceptEventArgs) {
        if (info.socketId != this.serverSocketId) { return; }

        chrome.sockets.tcp.onReceive.addListener(recvInfo => {
            if (recvInfo.socketId != info.socketId) {
                return;
            }
            this.messages$.next({ clientSocketId: recvInfo.socketId, data: recvInfo.data });
        });
        chrome.sockets.tcp.setPaused(info.socketId, false);
    }
}
