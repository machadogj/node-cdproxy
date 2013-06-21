var assert    = require('assert'),
    cdroxy = require('../'),
    connect   = require('connect'),
    http      = require('http'),
    request   = require('request');


describe('cdroxy', function () {

    before(function () {
        connect()
            .use(function ( req, res ) {
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