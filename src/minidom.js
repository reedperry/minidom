import { MiniDOMBuilder } from './builder';
import { MiniDOMMounter } from './mounter';

export const minidom = {
  create: elString => MiniDOMBuilder.build(elString),
  append: (element, parent) => MiniDOMMounter.append(element, parent),
  replace: (element, parent) => MiniDOMMounter.append(element, parent),
}

