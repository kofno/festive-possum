import AjaxResponse from './AjaxResponse';

export interface HttpSuccess<A> {
  response: AjaxResponse;
  result: A;
}

export const httpSuccess = <A>(response: AjaxResponse, result: A): HttpSuccess<A> =>
  ({ response, result });
