import axios, { AxiosRequestConfig, AxiosResponse, CancelToken } from 'axios';
import Decoder from 'jsonous';
import { err, ok, Result } from 'resulty';
import { Reject, Resolve, Task } from 'taskarian';
import AjaxResponse from './AjaxResponse';
import { convertHeaderObject, Header } from './Headers';
import { badPayload, badStatus, HttpError, networkError, timeout } from './HttpError';
import { httpSuccess, HttpSuccess } from './HttpSuccess';
import { Request } from './Request';

function handleResponse<A>(
  axioResponse: AxiosResponse<unknown>,
  decoder: Decoder<A>
): Result<HttpError, HttpSuccess<A>> {
  const response: AjaxResponse = {
    body: axioResponse.data,
    headers: convertHeaderObject(axioResponse.headers),
    status: axioResponse.status,
    statusText: axioResponse.statusText,
  };
  const result = decoder.decodeAny(axioResponse.data);
  return result.cata({
    Err: (error) => err(badPayload(error, response)),
    Ok: (r) => ok(httpSuccess(response, r)),
  });
}

function headerReducer(memo: any, header: Header): any {
  memo[header.field] = header.value;
  return memo;
}

function configureRequest<A>(request: Request<A>, cancelToken: CancelToken): AxiosRequestConfig {
  return {
    url: request.url,
    method: request.method,
    data: request.data,
    timeout: request.timeout,
    withCredentials: request.withCredentials,
    headers: request.headers.reduce(headerReducer, {}),
    cancelToken,
  };
}

function handleRequestError(err: any): HttpError {
  if (axios.isCancel(err)) {
    return networkError();
  } else if (err.response) {
    const response = err.response as AxiosResponse;
    return badStatus({
      body: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: convertHeaderObject(response.headers),
    });
  } else if (err.code && err.code === 'ECONNABORTED') {
    return timeout();
  } else {
    return networkError();
  }
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
  return new Task((reject, resolve) => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    const axiosReq = configureRequest(request, source.token);
    axios(axiosReq)
      .then((resp) => handleResponse(resp, request.decoder))
      .then((result) => result.cata({ Ok: resolve, Err: reject }))
      .catch((err) => reject(handleRequestError(err)));
    return () => source.cancel('Request cancelled');
  });
}

/*
 * Converts a request object to an Http Task.
 *
 * A successful request will result in your decoded object.
 *
 * A failed request will result in an HttpError object.
 */
export function toHttpTask<A>(request: Request<A>): Task<HttpError, A> {
  return toHttpResponseTask(request).map((r) => r.result);
}

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
