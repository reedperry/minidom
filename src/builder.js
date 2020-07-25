import { MiniDOMParser } from './parser'

export class MiniDOMBuilder {
  static build(elementString, children) {
    const parsedElement = MiniDOMParser.parse(elementString)
    const constructedElement = this.construct(parsedElement, children)
    return this.builder(constructedElement)
  }

  static construct(elDef, children) {
    let el = document.createElement(elDef.tagName)

    if (elDef.id) {
      el.id = elDef.id
    }

    if (elDef.classes.length) {
      for (let c of elDef.classes) {
        el.classList.add(c)
      }
    }

    if (elDef.attributes) {
      for (let attr of elDef.attributes) {
        el.setAttribute(attr.name, elDef.attributes[attr.value])
      }
    }

    let currentLevel = el
    let appendedLevel

    for (const child of children) {
      if (Array.isArray(currentLevel)) {
        if (Array.isArray(child)) {
          appendedLevel = []
          currentLevel.forEach((siblingEl) => {
            child.forEach((c) => {
              appendedLevel.push(siblingEl.appendChild(c.cloneNode()))
            })
          })
        } else {
          appendedLevel = []
          currentLevel.forEach((siblingEl) => {
            appendedLevel.push(siblingEl.appendChild(child.cloneNode()))
          })
        }
      } else {
        if (Array.isArray(child)) {
          appendedLevel = []
          child.forEach((c) => {
            appendedLevel.push(currentLevel.appendChild(c.cloneNode()))
          })
        } else {
          appendedLevel = currentLevel.appendChild(child)
        }
      }

      currentLevel = appendedLevel
    }

    return el
  }

  static render(elemStr) {
    const elem = this.build(elemStr).render()
    return elem
  }

  static builder(element) {
    return {
      render: () => element,
      click: MiniDOMBuilder.click.bind(MiniDOMBuilder, element),
      on: MiniDOMBuilder.on.bind(MiniDOMBuilder, element),
      withAttrs: MiniDOMBuilder.withAttrs.bind(MiniDOMBuilder, element),
      withStyle: MiniDOMBuilder.withStyle.bind(MiniDOMBuilder, element),
      withText: MiniDOMBuilder.withText.bind(MiniDOMBuilder, element),
    }
  }

  static click(elem, cb) {
    elem.addEventListener('click', cb)
    return MiniDOMBuilder.builder(elem)
  }

  static on(elem, event, cb) {
    elem.addEventListener(event, cb)
    return MiniDOMBuilder.builder(elem)
  }

  static withAttrs(elem, attrs) {
    Object.assign(elem, attrs)
    return MiniDOMBuilder.builder(elem)
  }

  static withStyle(elem, style) {
    Object.assign(elem.style, style)
    return MiniDOMBuilder.builder(elem)
  }

  static withText(elem, text) {
    elem.textContent = text
    return MiniDOMBuilder.builder(elem)
  }
}
