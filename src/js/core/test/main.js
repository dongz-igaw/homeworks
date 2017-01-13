var assert = require('assert');

describe('HOMEWORKS CORE TEST', function() {
	before(function() {
		this.jsdom = require('jsdom-global')();
		global.$ = global.jQuery = require('jquery');
		this.core = require('../index');

		$('body').html(`
			<div id="test" data-test="true" data-pen="#target">TEST</div>
			<div id="target">TARGET</div>
		`);
	});

	after(function() {
		this.jsdom();
	});

	it('#1 VIEW HOOK TEST', function(done) {
		(function(target, value) {
			var elementID = this.attr('id');
			var targetID = target.attr('id');

			try {
				assert.equal(elementID, 'test', 'VIEW HOOK this element ID is \'test\'.');
			} catch(error) {
				return done(error);
			}

			try {
				assert.equal(targetID, 'target', 'VIEW HOOK target element ID is \'target\'.');
			} catch(error) {
				return done(error);
			}

			try {
				assert.equal(value, true, 'VIEW HOOK value is true.');
			} catch(error) {
				return done(error);
			}

			done();
		}).hook('test');
	});

	it('#2 COMPONENT TEST', function(done) {
		this.core.ComponentMethod('component', {
			init: function(element, target) {
				var context = this;
				var local = context.local;
				var options = local._options;
				
				try {
					assert.equal(local._id, 'component', 'COMPONENT ID is \'component\'.');
				} catch(error) {
					return done(error);
				}

				try {
					assert.equal(local._init, true, 'COMPONENT INIT is true.');
				} catch(error) {
					return done(error);
				}

				try {
					assert.equal(options.key, 'value', 'COMPONENT OPTIONS of key is \'value\'.');
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
		}).hook('test');
	});
});