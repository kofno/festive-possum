import Decoder, { field, string } from 'jsonous';
import { get, Request, toHttpTask } from './../../src/index';

const decoder: Decoder<string> = field('title', string);

const request: Request<string> = {
  url: 'https://jsonplaceholder.typicode.com/posts/1',
  method: 'get',
  withCredentials: false,
  data: {},
  timeout: 0,
  headers: [],
  decoder,
};

get('/foo').withDecoder(decoder);

// tslint:disable-next-line:no-console
toHttpTask(request).fork(e => console.error(e), data => console.log('Success:', data));
