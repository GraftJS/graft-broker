
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
