# node-loggly-bulk

[![Version npm](https://img.shields.io/npm/v/node-loggly-bulk.svg?style=flat-square)](https://www.npmjs.com/package/node-loggly-bulk)[![npm Downloads](https://img.shields.io/npm/dm/node-loggly-bulk.svg?style=flat-square)](https://www.npmjs.com/package/node-loggly-bulk)

[![NPM](https://nodei.co/npm/node-loggly-bulk.png?downloads=true&downloadRank=true)](https://nodei.co/npm/node-loggly-bulk/)

A client implementation for Loggly in node.js. Check out Loggly's [Node logging documentation](https://www.loggly.com/docs/nodejs-logs/) for more.

## Usage

The `node-loggly-bulk` library is compliant with the [Loggly API][api]. Using `node-loggly-bulk` you can send logs to Loggly.

### Getting Started
Before we can do anything with Loggly, we have to create a client with valid credentials. We will authenticate for you automatically:

``` js
  var loggly = require('node-loggly-bulk');

  var client = loggly.createClient({
    token: "your-really-long-input-token",
    subdomain: "your-subdomain",
    //
    // Optional: Tag to send with EVERY log message
    //
    tags: ['global-tag']
  });
```

### Logging
There are two ways to send log information to Loggly via node-loggly-bulk. The first is to simply call client.log with an appropriate input token:

``` js
  client.log('127.0.0.1 - Theres no place like home', function (err, result) {
    // Do something once you've logged
  });
```

Note that the callback in the above example is optional, if you prefer the 'fire and forget' method of logging:

``` js
  client.log('127.0.0.1 - Theres no place like home');
```

### Logging with Tags

If you're using Loggly's [tags](https://www.loggly.com/docs/tags/) functionality, simply include an array of tags as the second argument to the `log` method:

``` js
  client.log('127.0.0.1 - Theres no place like home', [ 'dorothy' ], function (err, result) {
    // Do something once you've logged
  });
```

*note* Tags passed into the log function will be merged with any global tags you may have defined.


### Logging Shallow JSON Objects as a String
In addition to logging pure strings it is also possible to pass shallow JSON object literals (i.e. no nested objects) to client.log(..) or input.log(..) methods, which will get converted into the [Loggly recommended string representation][sending-data]. So

``` js
  var source = {
    foo: 1,
    bar: 2,
    buzz: 3
  };

  input.log(source);
```

will be logged as:

```
  foo=1,bar=2,buzz=3
```

### Logging JSON Objects
It is also possible to log complex objects using the new JSON capabilities of Loggly. To enable JSON functionality in the client simply add 'json: true' to the configuration:

``` js
  var config = {
    token: 'token',
    subdomain: "your-subdomain",
    json: true
  };
```

When the json flag is enabled, objects will be converted to JSON using JSON.stringify before being transmitted to Loggly. So

``` js
  var source = {
    foo: 1,
    bar: 2,
    buzz: {
      sheep: 'jumped',
      times: 10
    }
  };

  input.log(source);
```

will be logged as:

``` json
  { "foo": 1, "bar": 2, "buzz": {"sheep": "jumped", "times": 10 }}
```

### Logging arrays
It is possible to send arrays, which will result in one single request to Loggly.

``` js
  input.log([ {iam:'number 1'}, {iam:'number 2'} ])
```

## Installation

### Installing npm (node package manager)
``` bash
  $ curl http://npmjs.org/install.sh | sh
```

### Installing node-loggly-bulk
``` bash
  $ npm install node-loggly-bulk
```

## Run Tests

``` bash
  $ npm run test
```


#### Author: [Charlie Robbins](http://www.github.com/indexzero)
#### Contributors: [Marak Squires](http://github.com/marak), [hij1nx](http://github.com/hij1nx), [Kord Campbell](http://loggly.com), [Erik Hedenström](http://github.com/ehedenst),

[api]: http://www.loggly.com/docs/api-overview/
[sending-data]: http://www.loggly.com/docs/api-sending-data/
[search-api]: http://www.loggly.com/docs/api-retrieving-data/
[search]: http://www.loggly.com/docs/search-overview/
[vows]: http://vowsjs.org
