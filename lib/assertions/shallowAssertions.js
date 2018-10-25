'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.triggerEvent = exports.installInto = undefined;

var _unexpectedHtmllikeJsxAdapter = require('unexpected-htmllike-jsx-adapter');

var _unexpectedHtmllikeJsxAdapter2 = _interopRequireDefault(_unexpectedHtmllikeJsxAdapter);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _shallow = require('react-test-renderer/shallow');

var _AssertionGenerator = require('./AssertionGenerator');

var _AssertionGenerator2 = _interopRequireDefault(_AssertionGenerator);

var _reactEventNames = require('../reactEventNames');

var _reactEventNames2 = _interopRequireDefault(_reactEventNames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function triggerEvent(expect, renderer, target, eventName, eventArgs) {

    if (!target) {
        target = renderer.getRenderOutput();
    }

    var handlerPropName = 'on' + eventName[0].toUpperCase() + eventName.substr(1);
    var handler = target.props[handlerPropName];
    if (typeof handler !== 'function') {
        return expect.fail({
            diff: function diff(output) {
                return output.error('No handler function prop ').text("'" + handlerPropName + "'").error(' on the target element');
            }
        });
    }
    handler(eventArgs);
    return renderer;
}

function getMessageOnly(options) {
    if (this.getErrorMode() === 'bubble' && this.parent) {
        return getMessageOnly.call(this.parent, options);
    }
    var output = this.outputFromOptions(options);
    if (this.expect.testDescription) {
        output.append(this.expect.standardErrorMessage(output.clone(), options));
    } else if (typeof this.output === 'function') {
        this.output.call(output, output);
    }
    return output;
}

function installInto(expect) {

    var assertionGenerator = new _AssertionGenerator2.default({
        ActualAdapter: _unexpectedHtmllikeJsxAdapter2.default,
        QueryAdapter: _unexpectedHtmllikeJsxAdapter2.default,
        ExpectedAdapter: _unexpectedHtmllikeJsxAdapter2.default,
        actualTypeName: 'ReactShallowRenderer',
        queryTypeName: 'ReactElement',
        expectedTypeName: 'ReactElement',
        getRenderOutput: function getRenderOutput(renderer) {
            return renderer.getRenderOutput();
        },
        actualRenderOutputType: 'ReactElement',
        getDiffInputFromRenderOutput: function getDiffInputFromRenderOutput(renderOutput) {
            return renderOutput;
        },
        rewrapResult: function rewrapResult(renderer, target) {
            return target;
        },
        triggerEvent: triggerEvent.bind(null, expect)
    });
    assertionGenerator.installInto(expect);

    // We can convert ReactElements to a renderer by rendering them - but we only do it for `with event`
    expect.addAssertion('<ReactElement> with event <string> <assertion?>', function (expect, subject, eventName) {
        var renderer = (0, _shallow.createRenderer)();
        renderer.render(subject);

        for (var _len = arguments.length, assertion = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
            assertion[_key - 3] = arguments[_key];
        }

        return expect.apply(undefined, [renderer, 'with event', eventName].concat(assertion));
    });

    expect.addAssertion('<ReactElement> with event (' + _reactEventNames2.default.join('|') + ') <assertion?>', function (expect, subject) {
        for (var _len2 = arguments.length, assertion = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
            assertion[_key2 - 2] = arguments[_key2];
        }

        return expect.apply(undefined, [subject, 'with event', expect.alternations[0]].concat(assertion));
    });

    expect.addAssertion('<ReactElement> with event <string> <object> <assertion?>', function (expect, subject, eventName, eventArgs) {
        var renderer = (0, _shallow.createRenderer)();
        renderer.render(subject);

        for (var _len3 = arguments.length, assertion = Array(_len3 > 4 ? _len3 - 4 : 0), _key3 = 4; _key3 < _len3; _key3++) {
            assertion[_key3 - 4] = arguments[_key3];
        }

        return expect.apply(undefined, [renderer, 'with event', eventName, eventArgs].concat(assertion));
    });

    expect.addAssertion('<ReactElement> with event (' + _reactEventNames2.default.join('|') + ') <object> <assertion?>', function (expect, subject, eventArgs) {
        return expect.apply(undefined, [subject, 'with event', expect.alternations[0], eventArgs].concat(_toConsumableArray(assertion)));
    });

    // Add 'when rendered' to render with the shallow renderer
    expect.addAssertion('<ReactElement> when rendered <assertion?>', function (expect, subject) {
        var renderer = (0, _shallow.createRenderer)();
        renderer.render(subject);
        return expect.withError(function () {
            expect.errorMode = 'bubble';
            return expect.shift(renderer);
        }, function (e) {
            expect.fail({
                message: function message(output) {
                    return output.error('expected ').appendInspected(subject).error(' when rendered').nl().i().append(getMessageOnly.call(e, output));
                },
                diff: function diff(output) {
                    return e.getDiffMessage(output);
                }
            });
        });
    });

    expect.addAssertion('<ReactElement> to [exactly] render [with all children] [with all wrappers] [with all classes] [with all attributes] as <ReactElement>', function (expect, subject, expected) {

        if (this.flags.exactly) {
            return expect(subject, 'when rendered', 'to have exactly rendered', expected);
        }
        return expect(subject, 'when rendered to have rendered [with all children] [with all wrappers] [with all classes] [with all attributes]', expected);
    });

    expect.addAssertion('<ReactElement> to [exactly] render [with all children] [with all wrappers] [with all classes] [with all attributes] as <array-like>', function (expect, subject, expected) {

        var renderer = (0, _shallow.createRenderer)();
        renderer.render(subject);
        return expect(renderer, 'to have [exactly] rendered ' + '[with all children] [with all wrappers] [with all classes] [with all attributes]', expected);
    });

    expect.addAssertion('<ReactShallowRenderer> to have [exactly] rendered ' + '[with all children] [with all wrappers] [with all classes] [with all attributes] <array-like>', function (expect, subject, expected) {
        var output = subject.getRenderOutput();

        return expect(output, 'to satisfy', expected.map(function (element) {
            return expect.it('to have [exactly] rendered [with all children] [with all wrappers] [with all classes] [with all attributes]', element);
        }));
    });

    return assertionGenerator;
}

exports.installInto = installInto;
exports.triggerEvent = triggerEvent;