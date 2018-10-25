'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* These tests check that the right error message appears when requiring the modules in the wrong order
 * These tests can therefore not be run in conjunction with the other tests, and must be run separately
 */

var EmulateDom = require('../helpers/emulateDom');

var React = require('react');
var TestUtils = require('react-dom/test-utils');

var Unexpected = require('unexpected');
var UnexpectedReact = require('../../unexpected-react');

var expect = Unexpected.clone().use(UnexpectedReact);

var TestComp = function (_React$Component) {
    _inherits(TestComp, _React$Component);

    function TestComp() {
        _classCallCheck(this, TestComp);

        return _possibleConstructorReturn(this, (TestComp.__proto__ || Object.getPrototypeOf(TestComp)).apply(this, arguments));
    }

    _createClass(TestComp, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                null,
                'dummy'
            );
        }
    }]);

    return TestComp;
}(React.Component);

;

var EXPECTED_ERROR_MESSAGE = 'The global rendering hook is not attached\nThis probably means React was required before unexpected-react. Check that unexpected-react is required first';

describe('unexpected-react included after react', function () {

    it('throws the message when asserting `React to have been injected`', function () {

        expect(function () {
            return expect(React, 'to have been injected');
        }, 'to error', EXPECTED_ERROR_MESSAGE);
    });

    describe('with `to have rendered`', function () {

        it('throws a helpful error message', function () {
            var component = TestUtils.renderIntoDocument(React.createElement(TestComp, null));

            expect(function () {
                return expect(component, 'to have rendered', React.createElement(
                    'div',
                    null,
                    'dummy'
                ));
            }, 'to error', EXPECTED_ERROR_MESSAGE);
        });
    });

    describe('with `to contain`', function () {

        it('throws a helpful error message', function () {
            var component = TestUtils.renderIntoDocument(React.createElement(TestComp, null));

            expect(function () {
                return expect(component, 'to contain', React.createElement(
                    'div',
                    null,
                    'dummy'
                ));
            }, 'to error', EXPECTED_ERROR_MESSAGE);
        });
    });
});