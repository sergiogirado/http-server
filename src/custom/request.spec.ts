import { expect } from 'chai';
import { Subject } from 'rxjs';
import { TcpSocket } from './tcp-server';
import { CustomHttpRequest } from './request';

describe('CustomHttpRequest', () => {
  let clientData$: Subject<ArrayBuffer>;
  let client: TcpSocket;
  let request: CustomHttpRequest;

  function ab2str(buf: ArrayBuffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  }

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
        .readBody()
        .then(() => {
          expect(request.body).to.equal('');
          expect(request.method).to.equal('GET');
          expect(request.uri).to.equal('/');
          done();
        })
        .catch(error => done(error));

      clientData$.next(str2ab('GET / HTTP/1.1\n'));
      clientData$.next(str2ab('Header1: Value1\n'));
      clientData$.next(str2ab('\n'));
    });
    
    it('should support incomplete data for request with body', (done) => {
      request
        .readBody()
        .then(() => {
          expect(request.body).to.equal('10');
          expect(request.method).to.equal('POST');
          expect(request.uri).to.equal('/');
          done();
        })
        .catch(error => done(error));

        clientData$.next(str2ab('POST / HTTP/1.1\n'));
        clientData$.next(str2ab('Content-Length: 2\n'));
        clientData$.next(str2ab('\n10'));
    });
  });
});
