import { ok } from 'resulty';
import Request, { DecoderFn, Method } from './Request';
import { Header } from './Headers';

/**
 * A different approach to building a request object. Instead of object
 * literals, we can use this builder object to contruct a request in stages.
 * Modifications are immutable. A new instance of the RequestBuilder is
 * returned in each case.
 */
export class RequestBuilder<A> {
  private readonly request: Request<A>;

  constructor(aRequest: Request<A>) {
    this.request = aRequest;
  }

  get url(): string {
    return this.request.url;
  }

  get method(): Method {
    return this.request.method;
  }

  get data(): any {
    return this.request.data;
  }

  get timeout(): number {
    return this.request.timeout;
  }

  get headers(): Header[] {
    return this.request.headers;
  }

  get withCredentials(): boolean {
    return this.request.withCredentials;
  }

  get decoder(): DecoderFn<A> {
    return this.request.decoder;
  }

  public withData(data: any): RequestBuilder<A> {
    return new RequestBuilder({ ...this.request, data });
  }

  public withTimeout(timeout: number): RequestBuilder<A> {
    return new RequestBuilder({ ...this.request, timeout });
  }

  public setWithCredentials(withCredentials: boolean): RequestBuilder<A> {
    return new RequestBuilder({ ...this.request, withCredentials });
  }

  public withDecoder<B>(decoder: DecoderFn<B>): RequestBuilder<B> {
    return new RequestBuilder({ ...this.request, decoder });
  }

  public withHeader(header: Header): RequestBuilder<A> {
    return new RequestBuilder({
      ...this.request,
      headers: [ ...this.request.headers, header ],
    });
  }
}

export default RequestBuilder;

/**
 * A convenient function for creating a basic get request.
 */
export function get(url: string): RequestBuilder<string> {
  return new RequestBuilder<string>({
    url,
    decoder: ok,
    method: 'get',
    timeout: 0,
    data: '',
    headers: [],
    withCredentials: true,
  });
}

/**
 * A convenient function for creating a basic post request.
 */
export function post(url: string): RequestBuilder<string> {
  return new RequestBuilder({
    url,
    decoder: ok,
    data: {},
    method: 'post',
    timeout: 0,
    headers: [],
    withCredentials: true,
  });
}

/**
 * A convenient function for creating a basic put request.
 */
export function put(url: string): RequestBuilder<string> {
  return new RequestBuilder({
    url,
    decoder: ok,
    data: {},
    method: 'put',
    timeout: 0,
    headers: [],
    withCredentials: true,
  });
}

/**
 * A convenient function for create a basic delete request.
 */
export function del(url: string): RequestBuilder<string> {
  return new RequestBuilder({
    url,
    decoder: ok,
    data: {},
    method: 'delete',
    timeout: 0,
    headers: [],
    withCredentials: true,
  });
}
