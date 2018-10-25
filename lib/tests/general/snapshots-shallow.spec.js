'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _unexpected = require('unexpected');

var _unexpected2 = _interopRequireDefault(_unexpected);

var _unexpectedSinon = require('unexpected-sinon');

var _unexpectedSinon2 = _interopRequireDefault(_unexpectedSinon);

var _mockJasmine = require('../helpers/mock-jasmine');

var _mockJasmine2 = _interopRequireDefault(_mockJasmine);

var _jestMatchers = require('jest-matchers');

var _jestMatchers2 = _interopRequireDefault(_jestMatchers);

var _jest = require('../../jest');

var _jest2 = _interopRequireDefault(_jest);

var _ClickCounter = require('../components/ClickCounter');

var _ClickCounter2 = _interopRequireDefault(_ClickCounter);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _mockFs2 = require('mock-fs');

var _mockFs3 = _interopRequireDefault(_mockFs2);

var _module = require('module');

var _module2 = _interopRequireDefault(_module);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _shallow = require('react-test-renderer/shallow');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _snapshotLoader = require('../../helpers/snapshotLoader');

var _functions = require('../fixtures/functions');

var _functions2 = _interopRequireDefault(_functions);

var _snapshots = require('../../helpers/snapshots');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
// Note: These are imported later than the others, so that jasmine is mocked for the jest-matchers, but
// unexpected does not think it's running under jasmine


function loadSnapshotMock(snapshotPath) {
    var snapModule = new _module2.default(snapshotPath, null);
    snapModule.load(snapshotPath);
    return snapModule.exports;
}

(0, _snapshotLoader.injectLoader)(loadSnapshotMock);

var expect = _unexpected2.default.clone().use(_jest2.default).use(_unexpectedSinon2.default);

expect.output.preferredWidth = 80;

_bluebird2.default.promisifyAll(_fs2.default);

var fixtures = {};

describe('snapshots', function () {

    var PATH_TO_TESTS = '/path/to/tests';
    var state = void 0,
        removeUncheckedKeysStub = void 0;
    var renderer = void 0;

    before(function () {
        return _fs2.default.readdirAsync(_path2.default.join(__dirname, '../fixtures')).then(function (dirList) {
            return _bluebird2.default.all(dirList.map(function (entry) {
                return _fs2.default.readFileAsync(_path2.default.join(__dirname, '../fixtures', entry)).then(function (data) {
                    fixtures[_path2.default.basename(entry, '.snapshot')] = data.toString('utf-8');
                });
            }));
        });
    });

    beforeEach(function () {
        renderer = (0, _shallow.createRenderer)();
        removeUncheckedKeysStub = _sinon2.default.stub();
        state = {
            testPath: '/tmp/changeme.js',
            currentTestName: 'foo',
            snapshotState: {
                added: 0,
                updated: 0,
                unmatched: 0,
                update: undefined,
                removeUncheckedKeys: removeUncheckedKeysStub
            }
        };
        _jestMatchers2.default.setState(state);
        _sinon2.default.spy(_fs2.default, 'writeFileSync');
        (0, _snapshots.injectStateHooks)();
    });

    afterEach(function () {
        _fs2.default.writeFileSync.restore();
    });
    beforeEach(function () {
        var _mockFs;

        (0, _mockFs3.default)((_mockFs = {}, _defineProperty(_mockFs, PATH_TO_TESTS + '/__snapshots__/single.spec.unexpected-snap', fixtures.single), _defineProperty(_mockFs, PATH_TO_TESTS + '/__snapshots__/multiple.spec.unexpected-snap', fixtures.multiple), _defineProperty(_mockFs, PATH_TO_TESTS + '/__snapshots__/multipleclasses.spec.unexpected-snap', fixtures.multipleclasses), _mockFs));
    });

    afterEach(function () {
        _mockFs3.default.restore();
    });

    function initState(options) {
        state.testPath = _path2.default.join(PATH_TO_TESTS, options.testPath);
        state.currentTestName = options.testName;
        state.unexpectedSnapshot = null;
        if (options.update) {
            state.snapshotState.update = options.update;
        }
        if (options.updatev20) {
            state.snapshotState._updateSnapshot = options.updatev20;
        }
        _jestMatchers2.default.setState(state);
    }

    it('passes a single test snapshot', function () {

        initState({
            testPath: 'single.spec.js',
            testName: 'single test name'
        });

        renderer.render(_react2.default.createElement(_ClickCounter2.default, null));

        expect(renderer, 'to match snapshot');
        expect(_fs2.default.writeFileSync, 'was not called');
    });

    it('fails on a snapshot that doesn`t match', function () {
        initState({
            testPath: 'single.spec.js',
            testName: 'single test name'
        });
        renderer.render(_react2.default.createElement(_ClickCounter2.default, null));
        expect(function () {
            return expect(renderer, 'with event click', 'to match snapshot');
        }, 'to throw', ['expected', '<button onClick={function bound onClick() { /* native code */ }}>', '  Clicked 1 times', '</button>', 'with event click to match snapshot', '', '<button onClick={function bound onClick() { /* native code */ }}>', '  Clicked 1 times // -Clicked 1 times', '                  // +Clicked 0 times', '</button>'].join('\n'));
    });

    it('fails when an extra class is provided', function () {

        initState({
            testPath: 'multipleclasses.spec.js',
            testName: 'multiple classes'
        });

        renderer.render(_react2.default.createElement(_ClickCounter2.default, { className: 'one four three two' }));

        expect(function () {
            return expect(renderer, 'to match snapshot');
        }, 'to throw', ['expected <button .../> to match snapshot', '', '<button className="one four three two" // extra class \'four\'', '   onClick={function bound onClick() { /* native code */ }}>', '  Clicked 0 times', '</button>'].join('\n'));
    });

    it('fails when an extra attribute is provided', function () {

        initState({
            testPath: 'multipleclasses.spec.js',
            testName: 'multiple classes'
        });

        renderer.render(_react2.default.createElement(_ClickCounter2.default, { className: 'one three two', ariaLabel: 'test' }));

        expect(function () {
            return expect(renderer, 'to match snapshot');
        }, 'to throw', ['expected <button .../> to match snapshot', '', '<button className="one three two"', '   onClick={function bound onClick() { /* native code */ }}', '   ariaLabel="test" // ariaLabel should be removed', '>', '  Clicked 0 times', '</button>'].join('\n'));
    });

    it('passes with `to satisfy snapshot` when an extra class is provided', function () {

        initState({
            testPath: 'multipleclasses.spec.js',
            testName: 'multiple classes'
        });

        renderer.render(_react2.default.createElement(_ClickCounter2.default, { className: 'one four three two' }));

        expect(renderer, 'to satisfy snapshot');
    });

    it('passes with `to satisfy snapshot` when an extra attribute is provided', function () {

        initState({
            testPath: 'multipleclasses.spec.js',
            testName: 'multiple classes'
        });

        renderer.render(_react2.default.createElement(_ClickCounter2.default, { className: 'one three two', ariaLabel: 'test' }));

        expect(renderer, 'to satisfy snapshot');
    });

    describe('when update is true and the snapshot doesn`t match', function () {

        var snapshotPath = void 0;
        beforeEach(function () {
            initState({
                testPath: 'single.spec.js',
                testName: 'single test name',
                update: true
            });
            renderer.render(_react2.default.createElement(_ClickCounter2.default, null));
            snapshotPath = _path2.default.join(PATH_TO_TESTS, '__snapshots__/single.spec.unexpected-snap');
            expect(renderer, 'with event click', 'to match snapshot');
        });

        it('increments `updated`', function () {

            expect(state, 'to satisfy', {
                snapshotState: {
                    updated: 1,
                    added: 0,
                    update: true
                }
            });
        });

        it('writes the new snapshot', function () {
            expect(_fs2.default.writeFileSync, 'to have calls satisfying', [[snapshotPath, expect.it('to match', /exports\[`single test name 1`]/)]]);
        });

        it('writes the correct snapshot', function () {
            var snapshot = loadSnapshotMock(snapshotPath);
            expect(snapshot, 'to satisfy', {
                'single test name 1': {
                    type: 'button',
                    children: ['Clicked ', '1', ' times']
                }
            });
        });
    });

    describe('when update for jest v20 is `all` and the snapshot doesn`t match', function () {
        var snapshotPath = void 0;
        beforeEach(function () {
            initState({
                testPath: 'single.spec.js',
                testName: 'single test name',
                updatev20: 'all'
            });
            renderer.render(_react2.default.createElement(_ClickCounter2.default, null));
            snapshotPath = _path2.default.join(PATH_TO_TESTS, '__snapshots__/single.spec.unexpected-snap');
            expect(renderer, 'with event click', 'to match snapshot');
        });

        it('increments `updated`', function () {

            expect(state, 'to satisfy', {
                snapshotState: {
                    updated: 1,
                    added: 0,
                    _updateSnapshot: 'all'
                }
            });
        });

        it('writes the new snapshot', function () {
            expect(_fs2.default.writeFileSync, 'to have calls satisfying', [[snapshotPath, expect.it('to match', /exports\[`single test name 1`]/)]]);
        });

        it('writes the correct snapshot', function () {
            var snapshot = loadSnapshotMock(snapshotPath);
            expect(snapshot, 'to satisfy', {
                'single test name 1': {
                    type: 'button',
                    children: ['Clicked ', '1', ' times']
                }
            });
        });
    });

    describe('when update for jest v20 is `new` and the snapshot doesn`t match', function () {
        var snapshotPath = void 0;
        beforeEach(function () {
            initState({
                testPath: 'single.spec.js',
                testName: 'single test name',
                updatev20: 'new'
            });
            renderer.render(_react2.default.createElement(_ClickCounter2.default, null));
            snapshotPath = _path2.default.join(PATH_TO_TESTS, '__snapshots__/single.spec.unexpected-snap');
            expect(function () {
                return expect(renderer, 'with event click', 'to match snapshot');
            }, 'to throw');
        });

        it('does not increment `updated`', function () {

            expect(state, 'to satisfy', {
                snapshotState: {
                    updated: 0,
                    added: 0,
                    unmatched: 1,
                    _updateSnapshot: 'new'
                }
            });
        });

        it('does not write a new snapshot', function () {
            expect(_fs2.default.writeFileSync, 'to have calls satisfying', []);
        });
    });

    describe('when update for jest v20 is `new` and the snapshot is for a new test', function () {
        var snapshotPath = void 0;
        beforeEach(function () {
            initState({
                testPath: 'single.spec.js',
                testName: 'new test name',
                updatev20: 'new'
            });
            renderer.render(_react2.default.createElement(_ClickCounter2.default, null));
            snapshotPath = _path2.default.join(PATH_TO_TESTS, '__snapshots__/single.spec.unexpected-snap');
            expect(renderer, 'with event click', 'to match snapshot');
        });

        it('increments `added`', function () {

            expect(state, 'to satisfy', {
                snapshotState: {
                    updated: 0,
                    added: 1,
                    unmatched: 0,
                    _updateSnapshot: 'new'
                }
            });
        });

        it('writes the new snapshot', function () {
            expect(_fs2.default.writeFileSync, 'to have calls satisfying', [[snapshotPath, expect.it('to match', /exports\[`new test name 1`]/)]]);
        });

        it('writes the correct snapshot', function () {
            var snapshot = loadSnapshotMock(snapshotPath);
            expect(snapshot, 'to satisfy', {
                'new test name 1': {
                    type: 'button',
                    children: ['Clicked ', '1', ' times']
                }
            });
        });
    });

    describe('when update for jest v20 is `none` and the snapshot is for a new test', function () {
        var snapshotPath = void 0;
        beforeEach(function () {
            initState({
                testPath: 'single.spec.js',
                testName: 'new test name',
                updatev20: 'none'
            });
            renderer.render(_react2.default.createElement(_ClickCounter2.default, null));
            snapshotPath = _path2.default.join(PATH_TO_TESTS, '__snapshots__/single.spec.unexpected-snap');
            expect(function () {
                return expect(renderer, 'with event click', 'to match snapshot');
            }, 'to throw', ['expected', '<button onClick={function bound onClick() { /* native code */ }}>', '  Clicked 1 times', '</button>', 'with event click to match snapshot', '', 'No snapshot available, but running with `--ci`'].join('\n'));
        });

        it('increments `unmatched`', function () {

            expect(state, 'to satisfy', {
                snapshotState: {
                    updated: 0,
                    added: 0,
                    unmatched: 1,
                    _updateSnapshot: 'none'
                }
            });
        });

        it('does not write the new snapshot', function () {
            expect(_fs2.default.writeFileSync, 'to have calls satisfying', []);
        });
    });

    describe('when update for jest v20 is `new` and the snapshot is for a existing test', function () {
        var snapshotPath = void 0;
        beforeEach(function () {
            initState({
                testPath: 'single.spec.js',
                testName: 'single test name',
                updatev20: 'new'
            });
            renderer.render(_react2.default.createElement(_ClickCounter2.default, null));
            snapshotPath = _path2.default.join(PATH_TO_TESTS, '__snapshots__/single.spec.unexpected-snap');
            expect(state.snapshotState.getUncheckedCount(), 'to equal', 0);
            expect(renderer, 'to match snapshot');
        });

        it('increments `matched`', function () {

            expect(state, 'to satisfy', {
                snapshotState: {
                    updated: 0,
                    added: 0,
                    matched: 1,
                    _updateSnapshot: 'new'
                }
            });
        });

        it('does not write the new snapshot', function () {
            expect(_fs2.default.writeFileSync, 'to have calls satisfying', []);
        });

        it('leaves unchecked as 1', function () {
            expect(state.snapshotState.getUncheckedCount(), 'to equal', 1);
        });

        it('reduces unchecked to 0 after checking the second snapshot', function () {
            expect(renderer, 'with event', 'click', 'to match snapshot');
            expect(state.snapshotState.getUncheckedCount(), 'to equal', 0);
        });
    });

    describe('with functions', function () {
        it('compares with a snapshot with a normal function', function () {

            initState({
                testPath: 'withFunctions.spec.js',
                testName: 'with functions'
            });
            renderer.render(_react2.default.createElement(_ClickCounter2.default, { onMouseDown: _functions2.default.anonymous() }));
            expect(renderer, 'to match snapshot');

            // Now reset state back such that it actually tests the snapshot
            initState({
                testPath: 'withFunctions.spec.js',
                testName: 'with functions'
            });
            // Rerender, with a new instance of the anonymous function
            renderer.render(_react2.default.createElement(_ClickCounter2.default, { onMouseDown: _functions2.default.anonymous() }));
            expect(renderer, 'to match snapshot');
        });

        it('compares with a snapshot with a bound function', function () {

            initState({
                testPath: 'withFunctions.spec.js',
                testName: 'with functions'
            });
            renderer.render(_react2.default.createElement(_ClickCounter2.default, { onMouseDown: _functions2.default.boundContentArgs() }));
            expect(renderer, 'to match snapshot');

            // Now reset state back such that it actually tests the snapshot
            initState({
                testPath: 'withFunctions.spec.js',
                testName: 'with functions'
            });
            // Rerender, with a new instance of the function
            renderer.render(_react2.default.createElement(_ClickCounter2.default, { onMouseDown: _functions2.default.boundContentArgs() }));
            expect(renderer, 'to match snapshot');
        });

        it('fails with a snapshot with a normal function when the expected is bound', function () {

            initState({
                testPath: 'withFunctions.spec.js',
                testName: 'with functions'
            });
            renderer.render(_react2.default.createElement(_ClickCounter2.default, { onMouseDown: _functions2.default.boundContentArgs() }));
            // Create the snapshot with the bound function
            expect(renderer, 'to match snapshot');

            // Now reset state back such that it actually tests the snapshot
            initState({
                testPath: 'withFunctions.spec.js',
                testName: 'with functions'
            });
            // Rerender, with a different unbound function
            renderer.render(_react2.default.createElement(_ClickCounter2.default, { onMouseDown: _functions2.default.namedContentArgs() }));
            expect(function () {
                return expect(renderer, 'to match snapshot');
            }, 'to throw', ['expected <button .../> to match snapshot', '', '<button onClick={function bound onClick() { /* native code */ }}', '   onMouseDown={function doStuff(a, b) { /* ... */ }} // expected', '                                                      // function doStuff(a, b) {', '                                                      //   // comment', '                                                      //   return a + b;', '                                                      // }', '                                                      // to satisfy function bound bound3() { /* function body */ }', '                                                      //', '                                                      // -function doStuff(a, b) { /* function body */ }', '                                                      // +function bound bound3() { /* function body */ }', '>', '  Clicked 0 times', '</button>'].join('\n'));
        });
    });

    describe('with ReactElement as a prop', function () {
        var RenderProp = function (_React$Component) {
            _inherits(RenderProp, _React$Component);

            function RenderProp() {
                _classCallCheck(this, RenderProp);

                return _possibleConstructorReturn(this, (RenderProp.__proto__ || Object.getPrototypeOf(RenderProp)).apply(this, arguments));
            }

            _createClass(RenderProp, [{
                key: 'render',
                value: function render() {
                    return _react2.default.createElement(_ClickCounter2.default, { message: this.props.message });
                }
            }]);

            return RenderProp;
        }(_react2.default.Component);

        it('stores a valid snapshot', function () {

            initState({
                testPath: 'withElements.spec.js',
                testName: 'with elements'
            });
            renderer.render(_react2.default.createElement(RenderProp, { message: _react2.default.createElement(
                    'span',
                    { className: 'foo bar' },
                    'Magic'
                ) }));
            // Create the snapshot
            expect(renderer, 'to match snapshot');

            var snapshotPath = _path2.default.join(PATH_TO_TESTS, '__snapshots__/withElements.spec.unexpected-snap');
            var snapshot = loadSnapshotMock(snapshotPath);
            expect(snapshot, 'to satisfy', {
                'with elements 1': {
                    type: 'ClickCounter',
                    props: {
                        message: _react2.default.createElement(
                            'span',
                            { className: 'foo bar' },
                            'Magic'
                        )
                    },
                    children: []
                }
            });
        });

        it('validates a re-render with a message displaying the prop correctly', function () {
            initState({
                testPath: 'withElements.spec.js',
                testName: 'with elements'
            });
            renderer.render(_react2.default.createElement(RenderProp, { message: _react2.default.createElement(
                    'span',
                    { className: 'foo bar' },
                    'Magic'
                ) }));
            // Create the snapshot
            expect(renderer, 'to match snapshot');
            initState({
                testPath: 'withElements.spec.js',
                testName: 'with elements'
            });

            // Removed a class
            renderer.render(_react2.default.createElement(RenderProp, { message: _react2.default.createElement(
                    'span',
                    { className: 'bar' },
                    'Magic'
                ) }));

            // Validate the snapshot
            expect(function () {
                return expect(renderer, 'to match snapshot');
            }, 'to throw', ['expected <ClickCounter .../> to match snapshot', '', '<ClickCounter', '   message={<span className="bar">Magic</span>} // expected <span className="bar">Magic</span>', '                                                // to satisfy <span className="foo bar">Magic</span>', '                                                //', '                                                // <span className="bar" // missing class \'foo\'', '                                                // >', '                                                //   Magic', '                                                // </span>', '/>'].join('\n'));
        });

        it('compares the prop with `to satisfy` also when it`s a ReactElement', function () {
            initState({
                testPath: 'withElements.spec.js',
                testName: 'with elements'
            });
            renderer.render(_react2.default.createElement(RenderProp, { message: _react2.default.createElement(
                    'span',
                    { className: 'bar foo' },
                    'Magic'
                ) }));
            // Create the snapshot
            expect(renderer, 'to match snapshot');
            initState({
                testPath: 'withElements.spec.js',
                testName: 'with elements'
            });

            // switched class order
            renderer.render(_react2.default.createElement(RenderProp, { message: _react2.default.createElement(
                    'span',
                    { className: 'bar foo' },
                    'Magic'
                ) }));

            // Validate the snapshot
            expect(renderer, 'to match snapshot');
        });
    });
});