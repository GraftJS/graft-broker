
var test        = require('tape').test
  , graftBroker = require('./')

test('basic', function(t) {
  t.plan(1)

  var broker  = graftBroker()
    , updates = broker.ReadChannel()

  updates.on('data', function(data) {
    t.deepEqual(data, {
        cmd: 'publish'
      , topic: 'hello'
      , hello: 'world'
    })
  })

  broker.write({
      cmd: 'subscribe'
    , topic: 'hello'
    , messages: updates
  })

  broker.write({
      cmd: 'publish'
    , topic: 'hello'
    , hello: 'world'
  })
})

test('status ok', function(t) {
  t.plan(1)

  var broker  = graftBroker()
    , updates = broker.ReadChannel()
    , ret     = broker.ReadChannel()

  ret.on('data', function(data) {
    t.deepEqual(data, {
        status: 'subscribed'
      , topic: 'hello'
    })
  })

  broker.write({
      cmd: 'subscribe'
    , topic: 'hello'
    , messages: updates
    , ret: ret
  })
})

test('status failed because of no topic', function(t) {
  t.plan(1)

  var broker  = graftBroker()
    , updates = broker.ReadChannel()
    , ret     = broker.ReadChannel()

  ret.on('data', function(data) {
    t.deepEqual(data, {
        status: 'not subscribed'
      , reason: 'missing topic'
    })
  })

  broker.write({
      cmd: 'subscribe'
    , messages: updates
    , ret: ret
  })
})
