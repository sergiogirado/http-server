import { Observable } from 'rxjs';

/**
 * Tcp Server Abstraction
 */
export interface TcpServer {
  connections$: Observable<TcpSocket>;
  listen(port: number): Promise<void>;
  stop(): Promise<void>;
}

/**
 * Tcp Socket Abstraction
 */
export interface TcpSocket {
  data$: Observable<ArrayBuffer>;
  send(data: ArrayBuffer): Promise<void>;
}

/**
 * Tcp Abstraction
 */
export interface Tcp {
  connect(host: string, port: number): Promise<TcpSocket>;
  disconnect(): Promise<void>;
}

/**
 * Udp Abstraction
 */
export interface Udp {
  data$: Observable<ArrayBuffer>;
  send(data: ArrayBuffer, host: string, port: number): Promise<void>;
  listen(port: number): Promise<void>;
}
