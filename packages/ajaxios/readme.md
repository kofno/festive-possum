# ajaxios

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)

Ajaxios is a fork of Ajaxian. The key differenence is that, where Ajaxian wraps
XMLHttpRequest and only works in browsers, Ajaxios wraps the Axios library so
that it can work in browsers or Node. This means that the Ajaxios is suitable
for use in server side rendering or in a Node server or Lambda.

[More about the Axios library](https://www.npmjs.com/package/axios).

Ajaxios is NOT a drop-in replacement for Ajaxian. They are very similar APIs,
but some concessions have been made to how Axios works differently then the
XMLHttpRequest.

Ajaxios borrows heavily from the Elm Http module. In many ways it's not all
that different from other http libraries: build a request, send it to the
server, and then handle the response. The emphasis here is on handling error
responses correctly and consistently, without resorting to thrown exceptions.

## tasks

Instead of Promises, Ajaxios uses Futures (here called Tasks, from the
Taskarian library). Tasks are lazy and will not execute until forked. This
means a Task can be returned from a pure function. Tasks are also composeable.
You can build a complex chain of behaviors, while strictly controlling exactly
when the side effects happen. In this way I prefer them over Promises, which
are stateful and initiate side effects as soon as they are instantiated.

## errors

Ajaxios does not throw errors for failed requests. Instead, failed requests
are returned as one of several different types of errors. Error conditions
are documented this way because I believe that you create a better user
experience when you handle error conditions gracefully. I want to provide
the tools for doing that.

All of the error types are documented in the HttpError module.

## decoders

Decoders are another idea stolen from Elm. A decoder is a monad that converts
the response body of a request into a data structure that can be used by the
application.

Ajaxios uses Jsonous (as a peer dependency) to describe decoders.

If the data passes muster, then the decoder returns the data wrapped in
an Ok object. If the data is incorrect, then an error message will be
wrapped in an Err object and Ajaxios will return the result as a BadPayload
error.

# installing

> npm install --save ajaxios

> yarn add ajaxios

# usage

    import { toHttpTask, Request, header } from 'ajaxios';
    import { succeed } from 'jsonous';

    // Create a request object. This is a TS example.
    const request: Request<{}> = {
      url: '/some_end_point',
      method: 'post',
      data: { foo: 'bar' },
      timeout: 0,
      headers: [header('X-Some-Header', 'baz')],
      withCredentials: true,
      decoder: succeed({}),
    };

    toHttpTask(request).fork(
      err => console.error(err),
      data => console.log("Success!", data)
    );

There are some convenience builders for making requests, too:

    import { post } from 'ajaxios';

    const request = post('/some_end_point', { foo: bar }, succeed({}))
      .withHeader(header('X-Some-Header', 'baz'));

It is also possible to abort an HTTP request before it completes. Forking the
HTTP task returns an abort function from the underlying HTTP request object:

    const cancel = toHttpTask(request).fork(
      err => console.error(err),
      data => console.log("Success!", data),
    );

    cancel() // <-- aborts request
