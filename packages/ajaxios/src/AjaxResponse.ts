import { Header } from './Headers';

/**
 * The response from an ajax request
 */
export interface AjaxResponse {
  body: unknown;
  status: number;
  statusText: string;
  headers: Header[];
}

export default AjaxResponse;
