
/**
 * module dependencies
 */

var http = require('http'),
    url = require("url"),
    httpProxy = require('http-proxy'),
    http = require("http");


/**
 * adds an endpoint to proxy http calls.
 * @param {string} prefix for urls, default is 'proxy'
 * @api public
 */

module.exports = function ( prefix ) {

    //static proxies
    var proxy      = new httpProxy.RoutingProxy(),
        httpsProxy = new httpProxy.RoutingProxy({target: {https: true}});

    //variables
    prefix = prefix || 'proxy';
    var pattern = new RegExp("^\/" + prefix + "\/");

    //middleware for connect and express.

    return function ( req, res, next ) {

        //check if the url is under the prefix
        if(!req.url.match(pattern)) {  return next(); }

        var backendUrl = decodeURIComponent(req.url.substr( ("/" + prefix + "/").length )),
            parsedUrl = url.parse(backendUrl);


        //adjust the req object.
        req.url = backendUrl;
        req.headers.host = parsedUrl.host;

        if(parsedUrl.protocol !== "https:"){
            proxy.proxyRequest(req, res, {
              host: parsedUrl.hostname,
              port: parsedUrl.port || 80
            });
        }else{
            httpsProxy.proxyRequest(req, res, {
              host: parsedUrl.hostname,
              port: parsedUrl.port || 443
            });
        }
    };
};