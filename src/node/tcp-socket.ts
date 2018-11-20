import * as net from 'net';
import { Subject } from 'rxjs';
import { TcpSocket, TcpReceivedData } from '../generic/tcp';

export class NodeTcpSocket implements TcpSocket {

    messages$ = new Subject<TcpReceivedData>();

    private server: net.Server;
    private cache: {
        id: number,
        socket: net.Socket
    }[] = [];
    private counter = 0;
    constructor() {
        this.server = net.createServer(socket => {
            this.counter++;

            this.cache.push({id: this.counter, socket});

            socket.on('data', data => {
                const id = this.cache.find(c => c.socket === socket)!.id;
                const ab = new ArrayBuffer(data.length);
                const view = new Uint8Array(ab);
                for (let i = 0; i < data.length; ++i) {
                    view[i] = data[i];
                }
                this.messages$.next({ clientSocketId: id, data: ab });
            });
        });
    }

    send(clientSocketId: number, data: ArrayBuffer): Promise<number> {
        const client = this.cache.find(c => c.id === clientSocketId)!.socket;
        let buffer = new Buffer(data.byteLength);
        let view = new Uint8Array(data);
        for (var i = 0; i < buffer.length; ++i) {
            buffer[i] = view[i];
        }
        client.write(buffer);
        client.end();
        this.cache = this.cache.filter(c => c.id !== clientSocketId);
        return Promise.resolve(0);
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