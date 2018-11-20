import { Observable } from 'rxjs';

export interface TcpServer {
  connections$: Observable<TcpSocket>;
  listen(port: number): Promise<void>;
  stop(): Promise<void>;
}

export interface TcpSocket {
  data$: Observable<ArrayBuffer>;
  send(data: ArrayBuffer): Promise<void>;
}

export interface Tcp {
  connect(host: string, port: number): Promise<TcpSocket>
  disconnect(): Promise<void>;
}

export interface Udp {
  data$: Observable<ArrayBuffer>;
  send(data: ArrayBuffer, host: string, port: number): Promise<void>;
  listen(port: number): Promise<void>;
}
