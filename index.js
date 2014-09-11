
var mqstreams = require('mqstreams')
  , Graft     = require('graft')
  , inherits  = require('inherits')
  , through2  = require('through2')
  , mqemitter = require('mqemitter')

function through(func) {
  return through2.obj({
    highWaterMark: 16
  }, func)
}

function subscribe(mq) {
  return through(function(req, enc, done) {
    var returnStatus;

    if (!req.topic) {
      returnStatus = {
          status: 'not subscribed'
        , reason: 'missing topic'
      }
    } else {
      mq.readable(req.topic).pipe(req.messages)
      returnStatus = {
          status: 'subscribed'
        , topic: req.topic
      }
    }

    if (req.ret)
      req.ret.end(returnStatus)

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

  if (!mq)
    mq = mqemitter()

  mq = mqstreams(mq)

  graft.where({ cmd: 'subscribe' }, subscribe(mq))
  graft.where({ cmd: 'publish' }, publish(mq))

  return graft
}
