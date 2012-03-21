var Pipeline = require('pipeline')
  , BufferedStream = require('BufferedStream')
  , Html = require('./html')
  ;

function Response(server) {

  var stack = Pipeline()

  function defaultStack() {
    stack = Pipeline(arguments)
  }

  function wrap(response) {
    var wrappedResponse = new BufferedStream()

    var responseStack = stack.clone()

    responseStack.dest(response)
    responseStack.source(wrappedResponse)

    wrappedResponse.source = function source(source) {
      responseStack.source(source);
    }

    wrappedResponse.start = function start() {
      responseStack.pipe()
    }

    wrappedResponse.html = Html(response, wrappedResponse)

    return wrappedResponse
  }

  return {
      wrap: wrap
    , defaultStack: defaultStack
  }
}

module.exports = Response