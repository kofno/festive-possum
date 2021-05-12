import { err, ok, Result } from 'resulty';
import Task, { Reject, Resolve } from 'taskarian';
import AjaxResponse from './AjaxResponse';
import { Header, parseHeaders } from './Headers';
import { badPayload, badStatus, badUrl, HttpError, networkError, timeout } from './HttpError';
import { httpSuccess, HttpSuccess } from './HttpSuccess';
import { DecoderFn, Request } from './Request';

function send(xhr: XMLHttpRequest, data: any) {
  if (data) {
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(typeof data === 'string' ? data : JSON.stringify(data));
  } else {
    xhr.send();
  }
}

const handleResponse = <A>(
  xhr: XMLHttpRequest,
  decoder: DecoderFn<A>,
): Result<HttpError, HttpSuccess<A>> => {
  const response: AjaxResponse = {
    body: xhr.response,
    headers: parseHeaders(xhr.getAllResponseHeaders()),
    status: xhr.status,
    statusText: xhr.statusText,
  };

  if (xhr.status < 200 || xhr.status >= 300) {
    response.body = xhr.responseText;
    return err(badStatus(response));
  } else {
    const result = decoder(response.body);
    return result.cata({
      Err: error => err(badPayload(error, response)),
      Ok: r => ok(httpSuccess(response, r)),
    });
  }
};

function configureRequest<A>(xhr: XMLHttpRequest, request: Request<A>): void {
  xhr.setRequestHeader('Accept', 'application/json');
  request.headers.forEach((header: Header) => {
    xhr.setRequestHeader(header.field, header.value);
  });
  xhr.withCredentials = request.withCredentials;
  xhr.timeout = request.timeout || 0;
}

/*
 * Converts a request object to an Http Task.
 *
 * A successful request will result in an HttpSuccess object containing the result and also
 * the full response details (headers, status, etc.)
 *
 * A failed request results in an HttpError.
 */
export function toHttpResponseTask<A>(request: Request<A>): Task<HttpError, HttpSuccess<A>> {
  return new Task((reject: Reject<HttpError>, resolve: Resolve<HttpSuccess<A>>) => {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener('error', () => reject(networkError()));
    xhr.addEventListener('timeout', () => reject(timeout()));
    xhr.addEventListener('load', () => {
      return handleResponse(xhr, request.decoder).cata({
        Err: e => reject(e),
        Ok: d => resolve(d),
      });
    });

    try {
      xhr.open(request.method, request.url, true);
    } catch (e) {
      reject(badUrl(request.url));
    }

    configureRequest(xhr, request);
    send(xhr, request.data);

    return xhr.abort;
  });
}

/*
 * Converts a request object to an Http Task.
 *
 * A successful request will result in your decoded object.
 *
 * A failed request will result in an HttpError object.
 */
export const toHttpTask = <A>(request: Request<A>): Task<HttpError, A> =>
  toHttpResponseTask(request).map(r => r.result);

/**
 * Convenience function that will help make switch statements exhaustive
 */
function assertNever(x: never): never {
  throw new TypeError(`Unexpected object: ${x}`);
}

/**
 * A function helper that can be chained to an error using orElse so that
 * 404s can be handled as a successful call, if desired.
 */
export function ignore404With<A>(f: (e: HttpError) => A) {
  return (err: HttpError) =>
    new Task((reject: Reject<HttpError>, resolve: Resolve<A>) => {
      switch (err.kind) {
        case 'bad-url':
          reject(err);
          break;
        case 'timeout':
          reject(err);
          break;
        case 'network-error':
          reject(err);
          break;
        case 'bad-payload':
          reject(err);
          break;
        case 'bad-status':
          const response = err.response;
          response.status === 404 ? resolve(f(err)) : reject(err);
          break;
        default:
          assertNever(err);
      }
      // tslint:disable-next-line:no-empty
      return () => {};
    });
}
