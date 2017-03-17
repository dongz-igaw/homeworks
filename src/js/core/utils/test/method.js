var path = require('path');
var assert = require('assert');
var requirejs = require('requirejs');

describe('[core/utils/method] TEST', () => {
    var method = null;

    before(function() {
        this.jsdom = require('jsdom-global')();
        var $ = global.$ = global.jQuery = require('jquery');

        $('body').html(`
            <works-component pen="#pen">COMPONENT</div>
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
                init: function(element, args) {
                    var context = this;
                    var local = context.local;
                    var global = context.global;
                    var options = local._options;
                    
                    try {
                        assert.equal(local._id, 'component', 'COMPONENT LOCAL ID MUST BE `component`.');
                    } catch(error) {
                        return done(error);
                    }

                    try {
                        assert.equal(local._init, true, 'COMPONENT LOCAL INIT MUST BE `true`.');
                    } catch(error) {
                        return done(error);
                    }

                    try {
                        assert.equal(typeof local._prototype.init, 'function', 'COMPONENT LOCAL PROTOTYPE MUST HAVE `init` function.');
                    } catch(error) {
                        return done(error);
                    }

                    try {
                        assert.equal(options.key, 'value', 'COMPONENT OPTIONS OF KEY MUST BE `value`.');
                    } catch(error) {
                        return done(error);
                    }

                    try {
                        assert.deepEqual(options, $.extend(args, {
                            msg: 'Hello HOMEWORKS'
                        }), 'COMPONENT LOCAL OPTIONS MATCH THE ARGUMENT THAT HOOK SAND.');
                    } catch(error) {
                        return done(error);
                    }

                    try {
                        assert.equal(options.target.is($('#pen')), true, 'COMPONENT OPTIONS.target MUST BE `pen` element.');
                    } catch(error) {
                        return done(error);
                    }

                    try {
                        assert.equal(options.msg, 'Hello HOMEWORKS', 'COMPONENT GLOBAL OPTION KEY `msg` MUST BE `Hello HOMEWORKS`.');
                    } catch(error) {
                        return done(error);
                    }

                    done();
                },
                options: {
                    msg: 'Hello HOMEWORKS'
                }
            });

            (function(options) {
                var args = {
                    target: options.target,
                    key: 'value'
                };          
                this.component(args);
            }).hook('component');
        });
    });
});