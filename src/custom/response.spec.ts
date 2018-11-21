import * as chai from 'chai';
import * as chaiSpies from 'chai-spies';
import { expect } from 'chai';
import { Subject } from 'rxjs';
import { TcpSocket } from './tcp-server';
import { CustomHttpResponse } from './response';

describe('CustomHttpResponse', () => {
  let clientData$: Subject<ArrayBuffer>;
  let client: TcpSocket;
  let response: CustomHttpResponse;

  beforeEach(() => {
    chai.use(chaiSpies);
    clientData$ = new Subject();
    client = {
      data$: clientData$.asObservable(),
      send: data => Promise.resolve()
    };
    response = new CustomHttpResponse(client);
  });

  describe('string format', () => {
    it('should generate a default response', () => {
      const expected = [
        'HTTP/1.1 200 OK',
        '',
        '',
      ].join('\n');

      expect(response.toString()).to.equal(expected);
    });

    it('should generate a response with headers', () => {
      response.setHeader(<any>'Test-Header', 'Test header data');
      const expected = [
        'HTTP/1.1 200 OK',
        'Test-Header: Test header data',
        '',
        '',
      ].join('\n');

      expect(response.toString()).to.equal(expected);
    });

    it('should support plain text response', () => {
      response.text('Hello');
      const expected = [
        'HTTP/1.1 200 OK',
        'Content-Type: text/plain',
        '',
        'Hello'
      ].join('\n');

      expect(response.toString()).to.equal(expected);
    });

    it('should support json response', () => {
      response.json({ message: 'Hello' });
      const expected = [
        'HTTP/1.1 200 OK',
        'Content-Type: application/json',
        '',
        '{"message":"Hello"}'
      ].join('\n');

      expect(response.toString()).to.equal(expected);
    });
  });

  describe('end', () => {
    it('should send data to the socket', () => {
      const spy = chai.spy.on(client, 'send');
      response.end();
      expect(spy).to.have.been.called();
    });
  })
});
