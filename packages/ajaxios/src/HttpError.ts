import AjaxResponse from './AjaxResponse';

export interface BadUrl {
  kind: 'bad-url';
  message: string;
}

export function badUrl(message: string): HttpError {
  return { kind: 'bad-url', message };
}

export interface Timeout {
  kind: 'timeout';
}

export function timeout(): HttpError { return { kind: 'timeout' }; }

export interface NetworkError {
  kind: 'network-error';
}

export function networkError(): HttpError {
  return { kind: 'network-error' };
}

export interface BadStatus {
  kind: 'bad-status';
  response: AjaxResponse;
}

export function badStatus(response: AjaxResponse): HttpError {
  return { kind: 'bad-status', response } as HttpError;
}

export interface BadPayload {
  kind: 'bad-payload';
  message: string;
  response: AjaxResponse;
}

export function badPayload(message: string, response: AjaxResponse): HttpError {
  return { kind: 'bad-payload', message, response };
}

export type HttpError
  = BadUrl
  | Timeout
  | NetworkError
  | BadStatus
  | BadPayload
  ;
