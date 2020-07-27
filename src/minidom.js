import { MiniDOMBuilder } from './builder'
import { append, replace } from './mounter'

export const minidom = {
  create: (elString, ...children) => {
    return MiniDOMBuilder.render(elString, children)
  },
  build: (elString, ...children) => {
    return MiniDOMBuilder.build(elString, children)
  },
  append: (element, parent) => append(element, parent),
  replace: (element, parent) => replace(element, parent),
}
