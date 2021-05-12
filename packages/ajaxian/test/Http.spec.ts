import { err, ok } from 'resulty';
import { toHttpTask } from './../src/Http';
import { Method, Request } from './../src/Request';
import { get } from './../src/RequestBuilder';
import { toHttpResponseTask } from '../src';

const aGetRequest: Request<string> = {
  method: 'get' as Method,
  url: 'http://localhost:9876',
  data: {},
  timeout: 0,
  headers: [],
  withCredentials: false,
  decoder: () => ok('foo'),
};

const aFailedGetRequest = {
  method: 'get' as Method,
  url: 'http://localhost:9876',
  data: {},
  timeout: 0,
  headers: [],
  withCredentials: false,
  decoder: () => err('Bad mojo'),
};

describe('toHttpResponseTask', () => {
  it('can get the headers from a request', done => {
    toHttpResponseTask(aGetRequest).fork(
      err => done.fail(`Should have succeed: ${JSON.stringify(err)}`),
      result => {
        expect(result.response.headers.length).toBeGreaterThan(0);
        done();
      },
    );
  });
});

describe('toHttpTask', () => {
  it('can get data from websites', done => {
    toHttpTask(aGetRequest).fork(
      err => done.fail(`Should have succeeded: ${JSON.stringify(err)}`),
      () => done(),
    );
  });

  it('handle failed decoder errors', done => {
    toHttpTask(aFailedGetRequest).fork(() => done(), () => done.fail('Should not have succeeded'));
  });
});

describe('using the request builder', () => {
  it('can be used in place of a request', done => {
    toHttpTask(get('/')).fork(
      err => done.fail(`Should have succeeded: ${JSON.stringify(err)}`),
      () => done(),
    );
  });
});
