'use strict';

var EmulateDom = require('../helpers/emulateDom');

var Unexpected = require('unexpected');
var UnexpectedReact = require('../../unexpected-react');

var React = require('react');

var expect = Unexpected.clone().use(UnexpectedReact);

function MailBodyReset(_ref) {
    var content = _ref.content;

    return React.createElement('div', {
        className: 'MailBodyReset',
        dangerouslySetInnerHTML: { __html: content }
    });
}

it('should dangerouslySetInnerHTML the content', function () {
    return expect(React.createElement(MailBodyReset, { content: '<h1>Hello World</h1>' }), 'to deeply render as', React.createElement('div', {
        className: 'MailBodyReset',
        dangerouslySetInnerHTML: {
            __html: '<h1>Hello World</h1>'
        }
    }));
});