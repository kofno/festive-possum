import Decoder from 'jsonous';
import { Header } from './Headers';

export type Method = 'get' | 'post' | 'put' | 'patch' | 'head' | 'options' | 'delete';

export interface Request<A> {
  url: string;
  method: Method;
  data: any;
  timeout: number;
  headers: Header[];
  withCredentials: boolean;
  decoder: Decoder<A>;
}

export default Request;
