function Request(server) {
  return function(req, res) {
    var wrappedResponse = server.response.wrap(res)
    server.emit('woosh::request', req, wrappedResponse)
    wrappedResponse.start()
  }
}

module.exports = Request