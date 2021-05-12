import { field, string } from 'jsonous';
import Decoder from 'jsonous/Decoder';
import { get, Request, toHttpTask } from './../../src/index';

const decoder: Decoder<string> = field('title', string);

const request: Request<string> = {
  url: 'https://jsonplaceholder.typicode.com/posts/1',
  method: 'get',
  withCredentials: false,
  data: {},
  timeout: 0,
  headers: [],
  decoder: decoder.toJsonFn(),
};

get('/foo').withDecoder(decoder.toJsonFn());

// tslint:disable-next-line:no-console
toHttpTask(request).fork(e => console.error(e), data => console.log('Success:', data));
