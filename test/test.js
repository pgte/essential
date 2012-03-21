var Woosh = require('../')
  , test = require('tap').test
  , BufferedStream = require('bufferedstream')
  , Transformation = require('./transformation')
  , Trumpet = require('trumpet')
  , fs = require('fs')
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
    res.end('ABCDEF')
  })
  var request = new BufferedStream
  var response = new BufferedStream
  var hadData = false
  response.on('data', function(d) {
    t.equal(d.toString(), 'ABCDEF')
    hadData = true
  })
  
  response.on('end', function() {
    t.ok(hadData)
    t.end()
  })

  server.emit('request', request, response)

})


test('trumpet piped into response works', function(t) {

  var server = Woosh()
  server.on('woosh::request', function(req, res) {
    var tr = Trumpet()

    tr.select('.b span', function (node) {
      node.update(function (html) {
        return html.toUpperCase()
      })
    })

    tr.pipe(res)
    fs.createReadStream(__dirname + '/fixtures/update.html').pipe(tr)
  })

  var request = new BufferedStream
  var response = new BufferedStream
  response.setEncoding('utf8')

  var accumulatedResponse = ''
  
  response.on('data', function(d) {
    accumulatedResponse += d
  })

  response.on('end', function() {
    t.equal(accumulatedResponse, fs.readFileSync(__dirname + '/fixtures/update_transformed.html', 'utf8'))
    t.end()
  })

  server.emit('request', request, response)

})

test('trumpet automation works', function(t) {
  var server = Woosh()

  server.on('woosh::request', function(req, res) {
    res.html(__dirname + '/fixtures/update.html', function(t) {
      t.select('.b span', function (node) {
        node.update(function (html) {
          return html.toUpperCase()
        })
      })
    })
  })

  var request = new BufferedStream
  var response = new BufferedStream
  response.setEncoding('utf8')

  var accumulatedResponse = ''
  response.on('data', function(d) {
    accumulatedResponse += d
  })

  response.on('end', function() {
    t.equal(accumulatedResponse, fs.readFileSync(__dirname + '/fixtures/update_transformed.html', 'utf8'))
    t.end()
  })
  
  server.emit('request', request, response)
})
