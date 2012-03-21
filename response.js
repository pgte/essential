var Pipeline = require('pipeline')
  , BufferedStream = require('BufferedStream')
  , Html = require('./html')
  ;

function Response(server) {

  var transformations = Pipeline()

  function defaultTransformations() {
    var args = Array.prototype.slice.call(arguments)
    transformations = Pipeline(args)
  }

  function wrap(response) {
    var wrappedResponse = new BufferedStream()

    var responseTransformations = transformations.clone()

    responseTransformations.dest(response)
    responseTransformations.source(wrappedResponse)

    wrappedResponse.source = function source(source) {
      responseTransformations.source(source);
    }

    wrappedResponse.start = function start() {
      responseTransformations.pipe()
    }

    wrappedResponse.html = Html(response, wrappedResponse)

    return wrappedResponse
  }

  return {
      wrap: wrap
    , defaultTransformations: defaultTransformations
  }
}

module.exports = Response