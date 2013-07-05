var assert    = require('assert'),
    cdroxy    = require('../'),
    connect   = require('connect'),
    http      = require('http'),
    request   = require('request'),
    url       = require("url");


describe('cdroxy', function () {

    before(function () {
        connect()
            .use(function ( req, res ) {
                var query = url.parse(req.url).query;
                if (query)
                    res.end(query);
                else
                    res.end("response from remote");
            })
            .listen(9000);
    });

    describe('with default settings', function () {

        before(function () {
            connect()
                .use(cdroxy())
                .use(function ( req, res ) {
                    res.end("Hello from Connect!");
                })
                .listen(8000);
        });

        it('should proxy requests under /proxy', function ( done ) {

            request
                .get('http://localhost:8000/proxy/http://localhost:9000', function ( err, res, body ) {
                    assert.ok(!err);
                    assert.equal(res.statusCode, 200);
                    assert.equal(body, "response from remote");
                    done();
                });
        });

        it('should proxy encoded characters', function ( done ) {

            request
                .get({
                    uri: 'http://localhost:8000/proxy/http://localhost:9000/',
                    qs: { q: 'foo bar' }
                }, function ( err, res, body ) {
                    assert.equal(body, 'q=foo%20bar');
                    done();
                });
        });

        it('should proxy double encoded urls', function ( done ) {
            var url = encodeURIComponent('http://localhost:9000');
            request
                .get({
                    uri: 'http://localhost:8000/proxy/' + url
                }, function ( err, res, body ) {
                    assert.equal(body, "response from remote");
                    done();
                });
        });

        it('should ignore urls outside /proxy/', function ( done ) {

            request
                .get('http://localhost:8000/foo', function ( err, res, body ) {

                    assert.ok(!err);
                    assert.equal(res.statusCode, 200);
                    assert.equal(body, "Hello from Connect!");
                    done();
                });
        });
    });

    describe('with custom prefix', function () {

        before(function () {
            connect()
                .use(cdroxy('cdinvoker'))
                .listen(8001);
        })

        it('should proxy requests under the custom prefix', function ( done ) {

            request
                .get('http://localhost:8001/cdinvoker/http://localhost:9000', function ( err, res, body ) {

                    assert.ok(!err);
                    assert.equal(res.statusCode, 200);
                    assert.equal(body, "response from remote");
                    done();
                });
        });
    });
});