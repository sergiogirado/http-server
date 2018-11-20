import { Observable } from 'rxjs';

export interface TcpSocket {
  messages$: Observable<TcpReceivedData>;
  send(clientSocketId: number, data: ArrayBuffer): Promise<number>;
  listen(port: number): Promise<void>;
  stop(): Promise<void>;
}

export interface TcpReceivedData {
  clientSocketId: number;
  data: ArrayBuffer;
}
