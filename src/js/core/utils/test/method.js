var path = require('path');
var assert = require('assert');
var requirejs = require('requirejs');

describe('[core/utils/method] TEST', () => {
    var method = null;

    before(function() {
        this.jsdom = require('jsdom-global')();
        var $ = global.$ = global.jQuery = require('jquery');

        $('body').html(`
            <div data-component="true" data-pen="#pen">COMPONENT</div>
            <div id="pen">PEN ELEMENT</div>
        `);

        requirejs.config({
            nodeRequire: require,
            baseUrl: path.join(__dirname, '..')
        });
        requirejs('prototype');
        method = requirejs('method');
    });

    after(function() {
        this.jsdom();
        method = null;
    });

    describe('#1 method() TEST', () => {
        it('@1 `component` METHOD DEFINITION.', (done) => {
            new method('component', {
                init: function(element, target) {
                    var context = this;
                    var local = context.local;
                    var options = local._options;
                    
                    try {
                        assert.equal(local._id, 'component', 'COMPONENT ID MUST BE `component`.');
                    } catch(error) {
                        return done(error);
                    }

                    try {
                        assert.equal(local._init, true, 'COMPONENT INIT MUST BE `true`.');
                    } catch(error) {
                        return done(error);
                    }

                    try {
                        assert.equal(options.key, 'value', 'COMPONENT OPTIONS OF KEY MUST BE `value`.');
                    } catch(error) {
                        return done(error);
                    }

                    done();
                }
            });

            (function(target, value) {
                var args = {
                    key: 'value'
                };          
                this.component(args);
            }).hook('component');
        });
    });
});