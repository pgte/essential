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
  var mid1 = new Transformation(function(d) {
    return d.toString().toLowerCase()
  })
  var mid2 = new Transformation(function(d) {
    return d.toString().substring(1)
  })
  server.response.defaultTransformations(mid1, mid2)
  server.on('woosh::request', function(req, res) {
    res.end('ABCDEF')
  })
  var request = new BufferedStream
  var response = new BufferedStream
  var hadData = false
  response.on('data', function(d) {
    t.equal(d.toString(), 'bcdef')
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

// TODO
test('user should be able to include response transformations before the final destination', function(t) {
  var server = Woosh()
  var mid1 = new Transformation(function(d) {
    return d.toString().toLowerCase()
  })
  var mid2 = new Transformation(function(d) {
    return 'Z' + d.toString()
  })
  server.on('woosh::request', function(req, res) {
    res.beforeLast(mid1, mid2)
    res.end('ABCDEF')
  })
  var request = new BufferedStream
  var response = new BufferedStream
  var hadData = false
  response.on('data', function(d) {
    t.equal(d.toString(), 'Zabcdef')
    hadData = true
  })
  
  response.on('end', function() {
    t.ok(hadData)
    t.end()
  })

  server.emit('request', request, response)
})

// TODO
test('templates should be composable')

// TODO
test('user can bind on routes')

// TODO
test('can use request "middleware" to parse cookies, etc')

// TODO
test('user can reply JSON object')

// TODO
test('user can transform incoming stream')

// TODO
test('should have auth callback and `user` should be a thing')