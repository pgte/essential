# UNDER CONSTRUCTION

# Woosh

HTTP Framework that streams all the way.

Response Stream Stack

## Define a Server

```javascript
var Woosh = require('woosh')

var server = Woosh()

server.on('request', function(req, res) {
  res.end('Hello World!')
})

server.listen(8080)
```

## Define the Response Stream Stack

```javascript
server.response.defaultStack(zlib.createGzip())
```

## Listen for requests

```javascript
server.on('woosh::request', function(req, res) {
  res.write('This response text will get gzipped')
})
```

## Push a streaming trumpet template into the response

For this you first have to install trumpet via npm.

Then you can push the streaming template.

```javascript

var Trumpet = require('trumpet')
  , fs = require('fs')
  ;

server.on('woosh::request', function(req, res) {
  var tr = Trumpet()

  tr.select('.b span', function (node) {
    node.update(function (html) {
      return html.toUpperCase()
    })
  })

  tr.pipe(response)
  fs.createReadStream(__dirname + '/update.html').pipe(tr)

})
```

## You can automatically reply a template stream by using res.html()

```javascript
server.on('woosh::request', function(req, res) {

  res.html(__dirname + '/update.html', function(t) {
    t.select('.b span', function (node) {
      node.update(function (html) {
        return html.toUpperCase()
      })
    })
  })

})
```



# License

(The MIT License)

Copyright (c) 2011 Pedro Teixeira. http://about.me/pedroteixeira

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.