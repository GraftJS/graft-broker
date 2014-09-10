
var mqstreams = require('mqstreams')
  , Graft     = require('graft')
  , inherits  = require('inherits')
  , through2   = require('through2')

function through(func) {
  return through2.obj({
    highWaterMark: 16
  }, func)
}

function subscribe(mq) {
  return through(function(req, enc, done) {
    mq.readable(req.topic).pipe(req.messages)
    done()
  })
}

function publish(mq) {
  return through(function(req, enc, done) {
    mq.emit(req, done)
  })
}

module.exports = function(mq) {
  var graft = new Graft()

  if (!mq) {
    try {
      mq = require('mqemitter')()
    } catch(err) {
      console.err('missing mqemitter, install it with')
      console.err('npm install mqemitter --save')
      process.exit(-1)
    }
  }

  mq = mqstreams(mq)

  graft.where({ cmd: 'subscribe' }, subscribe(mq))
  graft.where({ cmd: 'publish' }, publish(mq))

  return graft
}
