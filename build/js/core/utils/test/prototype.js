'use strict';

var path = require('path');
var assert = require('assert');
var requirejs = require('requirejs');

describe('[core/utils/prototype] TEST', function () {
    before(function () {
        this.jsdom = require('jsdom-global')();
        var $ = global.$ = global.jQuery = require('jquery');

        $('body').html('\n            <div id="test" data-test="true" data-pen="#target">TEST</div>\n            <div id="target">TARGET</div>\n        ');

        requirejs.config({
            nodeRequire: require,
            baseUrl: path.join(__dirname, '..')
        });
        requirejs('prototype');
    });

    after(function () {
        this.jsdom();
    });

    describe('#1 String.prototype.mapping() TEST', function () {
        it('@1 STRING MUST BE `Hello World`.', function () {
            assert.equal('{hello} {world}'.mapping({
                hello: 'Hello',
                world: 'World'
            }), 'Hello World');
        });

        it('@2 STRING MUST BE `I think Homeworks is better than most modern framework ever, So I think you have to use Homeworks right now!`.', function () {
            assert.equal('I think {name} is better than most modern framework ever, So I think you have to use {name} {when}!'.mapping({
                name: 'Homeworks',
                when: 'right now'
            }), 'I think Homeworks is better than most modern framework ever, So I think you have to use Homeworks right now!');
        });
    });

    describe('#2 String.prototype.format() TEST', function () {
        it('@1 STRING MUST BE `Hello World`.', function () {
            assert.equal('{0} {1}'.format(['Hello', 'World']), 'Hello World');
        });

        it('@2 STRING MUST BE `Government of the people, by the people, for the people`.', function () {
            assert.equal('{0} of the {1}, by the {1}, for the {1}'.format(['Government', 'people']), 'Government of the people, by the people, for the people');
        });
    });

    describe('#3 Function.prototype.hook() TEST', function () {
        it('@1 BINDED ELEMENT ID MUST BE `test`.', function (done) {
            (function (target, value) {
                var elementID = this.attr('id');
                try {
                    assert.equal(elementID, 'test');
                } catch (error) {
                    return done(error);
                }

                done();
            }).hook('test');
        });

        it('@2 TARGETED ELEMENT ID MUST BE `target`.', function (done) {
            (function (target, value) {
                var targetID = target.attr('id');
                try {
                    assert.equal(targetID, 'target');
                } catch (error) {
                    return done(error);
                }

                done();
            }).hook('test');
        });

        it('@3 BINDED VALUE MUST BE `true`.', function (done) {
            (function (target, value) {
                try {
                    assert.equal(value, true);
                } catch (error) {
                    return done(error);
                }

                done();
            }).hook('test');
        });
    });
});
//# sourceMappingURL=prototype.js.map
