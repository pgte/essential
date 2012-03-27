var http = require('http')
  , Request = require('./request')
  , Response = require('./response')
  ;

function Woosh() {
  var server = http.createServer()
  server.response = Response(server)
  server.on('request', Request(server))
  return server;
}

module.exports = Woosh;