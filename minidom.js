const MiniDOMBuilder = require('./builder');
const MiniDOMMounter = require('./mounter');

module.exports = {
  element: elString => MiniDOMBuilder.construct(elString),
  elementTree: elString => MiniDOMBuilder.constructTree(elString),
  append: (element, parent) => MiniDOMMounter.append(element, parent),
  replace: (element, parent) => MiniDOMMounter.append(element, parent),
}

