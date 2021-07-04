/*
*
*

*/

// dependencies
const http = require('http')
const url = require('url')
const StringDecode = require('string_decoder').StringDecoder

// the server should respond to all requests
const server = http.createServer((req, res) => {

    // Get the url and parse it
    // let parsedUrl = new URL(req.url)
    let parsedUrl = url.parse(req.url, true)

    // Get the path from that url
    let path = parsedUrl.pathname
    let trimmedPath = path.replace(/^\/+|\/+$/g,'')

    // Get the query string as an object
    let queryStringObject = parsedUrl.query
    let queryStr = Object.create(null)
    queryStr = { ...queryStringObject}
    // console.log('queryStr', queryStr)
    /*
        let queryStringObject = parsedUrl.query
    * the above line failed bcz JS is trying to cast an object to a string
    * When casting an object to string js will try to call toString() method of that object (most JS Object have toString() method)
    * inherited from Object.prototype, but some have a null prototype, not have toString() method, so JS will fail to convert those object
    * to string primitive, and 'cant convert object to primitive error will rise' -bcz it lacks the toString() inherited from Object.prototype.
    *
    *  // TO CREATE A NULL PROTOTYPE OBJECT In JS user this method
    *  let travel = Object.create(null)
    *  // THE SOLUTION
    *  travel = {...travel}
    *  */


    // console.log('parsedUrl', parsedUrl.query)

    // Get the HTTP method
    let method = req.method.toLowerCase();

    // Get headers as an object
    let headers = req.headers;

    // Get the payload, if theres is any
    let decoder = new StringDecode('utf-8')
    let buffer = ''
    req.on('data', (data) => {
        buffer += decoder.write(data)
    })
    req.on('end', () => {
        buffer += decoder.end()

        // choose the handler this requests go to. If one is not found use the notFound handler
        let chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[[trimmedPath]] : handlers.notFound

        // construct the data object to send to the handler
        let data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer
        }

        // Route the request to the handler specified in the router
        chosenHandler(data, (statusCode, payload) => {

            // use the status code called back by the nandler, or default to 200
            statusCode = typeof (statusCode) === 'number' ? statusCode : 200

            // user the payload called back by the handler, or default to an empty object
            payload = typeof (payload) === 'object' ? payload : {}

            // Convert the payload to a string
            let payloadString = JSON.stringify(payload)

            // Return the response - the writeHead inbuilt fn comes with every on response object received by the http server
            res.setHeader('Content-Type', 'application-json')
            res.writeHead(statusCode)
            // res.end('Hello World is Marvo on the beat\n'); // send res
            res.end(payloadString); // send res

            // Log the request
            console.log('returning this response', statusCode, payloadString )
        })

    })

})

// start the serve and listen to port 3000
server.listen(3000, () => {
    console.log('THe server is listening on port 3000 now')
})

// define the handlers
const handlers = {}

// sample handler
handlers.sample = ((data, callback) => {
    // callback http status code and a payload object
    callback(406, {'name': 'sample handler'})
})

//not found handler
handlers.notFound = ((data, callback) => {
    callback(404)
})

// define request router
const router = {
    'sample': handlers.sample
}
