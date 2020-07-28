import { build, render } from './builder'
import { append, mount } from './mounter'

export const minidom = {
  create: (elString, ...children) => {
    return render(elString, children)
  },
  build: (elString, ...children) => {
    return build(elString, children)
  },
  append: (element, parent) => append(element, parent),
  mount: (element, parent) => mount(element, parent),
}
