# resulty

[![Build Status](https://travis-ci.org/kofno/resulty.svg?branch=master)](https://travis-ci.org/kofno/resulty)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=plastic)](https://github.com/semantic-release/semantic-release)


A disjunction implementation in TypeScript.

# install

> npm install --save resulty

> yarn add resulty

# usage

    import { ok, err } from 'resulty';

    function parse(s) {
      try {
        return ok(JSON.parse(s));
      }
      catch(e) {
        return err(e.message);
      }
    }

# docs

[API](https://kofno.github.io/resulty)
