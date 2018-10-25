'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _reactRenderHook = require('react-render-hook');

var _reactRenderHook2 = _interopRequireDefault(_reactRenderHook);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _unexpectedHtmllike = require('unexpected-htmllike');

var _unexpectedHtmllike2 = _interopRequireDefault(_unexpectedHtmllike);

var _unexpectedHtmllikeReactrenderedAdapter = require('unexpected-htmllike-reactrendered-adapter');

var _unexpectedHtmllikeReactrenderedAdapter2 = _interopRequireDefault(_unexpectedHtmllikeReactrenderedAdapter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function installInto(expect) {

    var renderedReactElementAdapter = new _unexpectedHtmllikeReactrenderedAdapter2.default({
        convertToString: true,
        concatTextContent: true
    });
    var htmlLikeRenderedReactElement = (0, _unexpectedHtmllike2.default)(renderedReactElementAdapter);

    expect.addType({

        name: 'RenderedReactElement',

        identify: function identify(value) {
            return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== null && (value._reactInternalInstance || value._reactInternalComponent) && (typeof value.setState === 'function' || _typeof(value.updater) === 'object' /* stateless components */);
        },
        inspect: function inspect(value, depth, output, _inspect) {
            var data = _reactRenderHook2.default.findComponent(value);
            return htmlLikeRenderedReactElement.inspect(data, depth, output, _inspect);
        }
    });

    expect.addType({
        name: 'RenderedReactElementData',

        identify: function identify(value) {

            return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== null && value.internalInstance && value.data && value.data.type && value.data.nodeType;
        },
        inspect: function inspect(value, depth, output, _inspect2) {
            return htmlLikeRenderedReactElement.inspect(value, depth, output, _inspect2);
        }
    });
}

exports.default = { installInto: installInto };