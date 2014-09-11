graft-broker&nbsp;&nbsp;[![Build Status](https://travis-ci.org/GraftJS/graft-broker.png)](https://travis-ci.org/GraftJS/graft-broker)
============

A [Graft](https://github.com/GraftJS/graft) microservice that implements a pub/sub broker.

Install
-------

```bash
npm install graft-broker --save
```

Usage
-----

```js
var broker  = graftBroker()
  , updates = broker.ReadChannel()
  , ret     = broker.ReadChannel()

ret.on('data', function(data) {
  console.log('subscription result', data)
  // prints
  // subscription result { status: 'subscribed', topic: 'hello' }
})

updates.on('data', function(data) {
  console.log('message received', data)

  // prints
  // message received { cmd: 'publish',
  //   topic: 'hello',
  //   hello: 'world' }
})

broker.write({
    cmd: 'subscribe'
  , topic: 'hello'
  , messages: updates // mandatory channel for updates
  , ret: ret // optional return channel
})

broker.write({
    cmd: 'publish'
  , topic: 'hello'
  , hello: 'world'
})
```

Subscribe errors
----------------

The subscribe command will return an error on the return channel if
there is no topic or no messages channel.
The error format follows the pattern:

```js
{
    status: 'not subscribed'
  , reason: 'missing topic'
}
```

License
-------

MIT
