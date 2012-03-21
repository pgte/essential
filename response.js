var Pipeline = require('pipeline')
  , BufferedStream = require('BufferedStream')
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

    responseStack.pipe()

    return wrappedResponse
  }

  return {
      wrap: wrap
    , defaultStack: defaultStack
  }
}

module.exports = Response