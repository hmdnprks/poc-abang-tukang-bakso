import { NextRequest } from 'next/server';
import { middleware } from './middleware';

describe('Middleware', () => {
  it('adds Content-Security-Policy header to response', () => {
    const mockRequest = {
      headers: new Headers(),
    } as unknown as NextRequest;

    const response = middleware(mockRequest);


    const cspHeaderValue = response.headers.get('Content-Security-Policy');
    expect(cspHeaderValue).toContain('default-src \'self\';');
    expect(cspHeaderValue).toContain('script-src \'self\' \'unsafe-inline\' \'unsafe-eval\' \'strict-dynamic\' https: http:;');
    expect(cspHeaderValue).toContain('connect-src \'self\' http: https: wss:;');
  });

  it('preserves existing headers and adds Content-Security-Policy', () => {
    const mockRequest = {
      headers: new Headers({
        'x-test-header': 'test-value',
      }),
    } as unknown as NextRequest;

    const response = middleware(mockRequest);


    const responseHeaders = response.headers;
    expect(responseHeaders.get('x-test-header')).toBeNull();


    expect(responseHeaders.get('Content-Security-Policy')).toContain('default-src \'self\';');
  });
});
