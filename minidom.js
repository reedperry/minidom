const MiniDOMBuilder = require('./builder');

const document = window.document;
if (!document) {
  throw new Error('No document object found!');
}

module.exports = query => new MiniDOMBuilder(document, query);

