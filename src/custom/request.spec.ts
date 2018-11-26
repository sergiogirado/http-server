import { Subject } from 'rxjs';

import { CustomHttpRequest } from './request';
import { TcpSocket } from './tcp-server';

/**
 * Custom Http request tests
 */
describe('CustomHttpRequest', () => {
  let clientData$: Subject<ArrayBuffer>;
  let client: TcpSocket;
  let request: CustomHttpRequest;

  function str2ab(str: string) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    const strLen = str.length;
    for (let i = 0; i < strLen; i += 1) {
      bufView[i] = str.charCodeAt(i);
    }

    return buf;
  }

  beforeEach(() => {
    clientData$ = new Subject();
    client = {
      data$: clientData$.asObservable(),
      send: data => Promise.resolve()
    };
    request = new CustomHttpRequest(client);
  });

  describe('readBody', () => {
    it('should support incomplete data for request with no body', (done) => {
      request
        .read()
        .then(() => {
          expect(request.body).toEqual('');
          expect(request.method).toEqual('GET');
          expect(request.uri.raw).toEqual('/');
          done();
        })
        .catch(error => done());

      clientData$.next(str2ab('GET / HTTP/1.1\n'));
      clientData$.next(str2ab('Header1: Value1\n'));
      clientData$.next(str2ab('\n'));
    });

    it('should support incomplete data for request with body', (done) => {
      request
        .read()
        .then(() => {
          expect(request.body).toEqual('10');
          expect(request.method).toEqual('POST');
          expect(request.uri.raw).toEqual('/');
          done();
        })
        .catch(error => done());

      clientData$.next(str2ab('POST / HTTP/1.1\n'));
      clientData$.next(str2ab('Content-Length: 2\n'));
      clientData$.next(str2ab('\n10'));
    });
  });
});
