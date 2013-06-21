Connect and Express middleware for proxying cross domain requests. Useful for avoiding JSONP and CORS support.

##Installation

	$ npm install cdproxy

##Usage

	var cdproxy = require('cdproxy');

	connect()
        .use(cdproxy('myprefix')) //proxy by default.
        .use(function ( req, res ) {
            res.end("Hello from Connect!");
        })
        .listen(8000);

    //GET http://localhost:8000/myprefix/http://myremote.server

`cdproxy` will reuse the req that receives from express/connect and override the host header only.

##Running unit tests

	$npm test

or simply

	$mocha