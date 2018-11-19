import { HttpStatusCode, } from './status';
import { HttpResponseHeaderName } from './headers';

export interface HttpResponse {
    end(): void;
    getStatus(): number;
    setStatus(code: HttpStatusCode): void;
    getHeader(name: HttpResponseHeaderName): string;
    setHeader(name: HttpResponseHeaderName, value: string): void;
    text(text: string): void;
    json<T>(data: T): void;
}