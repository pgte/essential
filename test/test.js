var Woosh = require('../')
  , test = require('tap').test
  , BufferedStream = require('bufferedstream')
  , Transformation = require('./transformation')
  ;

test('a server is returned by the constructor', function(t) {
  var server = Woosh()
  t.ok(server instanceof require('http').Server, 'server is HTTP Server')
  t.end()
})

test('a server emits the woosh::request when a normal request comes in', function(t) {
  var server = Woosh()
  var request = new BufferedStream
  var response = new BufferedStream
  server.on('woosh::request', function(req, res) {
    t.ok(!! req, 'has a request')
    t.ok(!! res, 'has a response')
    t.equal(req, request, 'request is original value')
    t.ok(res !== response, 'response is wrapped')
    t.end()
  })
  server.emit('request', request, response)
})

test('writing to a response goes through the default pipeline', function(t) {
  var server = Woosh()
  var mid = new Transformation(function(d) {
    return d.toLowerCase()
  })
  server.on('woosh::request', function(req, res) {
    res.write('ABCDEF')
  })
  var request = new BufferedStream
  var response = new BufferedStream
  server.emit('request', request, response)
  response.on('data', function(d) {
    t.equal('ABCDEF', d.toString())
    t.end()
  })

})