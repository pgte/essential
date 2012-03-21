var Trumpet = require('trumpet')
  , fs = require('fs')
  ;

function Html(response, wrappedResponse) {
  return function html(templatePath, callback) {
    var tr = Trumpet()
    if (callback) { callback(tr) }
    wrappedResponse.source(tr)
    var rs = fs.createReadStream(templatePath)
    wrappedResponse.source(rs)
    response.on('end', function() { console.log('response ended')})
  }
}


module.exports = Html