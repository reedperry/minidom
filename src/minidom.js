import { MiniDOMBuilder } from './builder'
import { MiniDOMMounter } from './mounter'

export const minidom = {
  create: (elString, ...children) => {
    return MiniDOMBuilder.build(elString, children)
  },
  append: (element, parent) => MiniDOMMounter.append(element, parent),
  replace: (element, parent) => MiniDOMMounter.append(element, parent),
}
