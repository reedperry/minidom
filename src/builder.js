import { MiniDOMParser } from './parser'

export class MiniDOMBuilder {
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

  static build(elementString, ...children) {
    // TODO Pass children down
    return this.builder(this.construct(MiniDOMParser.parseSingle(elementString)))
  }

  static construct(elDef) {
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

    if (elDef.children) {
      for (const child of elDef.children) {
        el.appendChild(MiniDOMBuilder.construct(child))
      }
    }

    return el
  }

  static buildTree(inputArray) {
    // Start validation - refactor
    if (!Array.isArray(inputArray)) {
      throw new Error('Invalid element string: Empty/missing')
    }

    if (inputArray.length === 0) {
      return []
    }

    // Won't happen, right?
    if (Array.isArray(inputArray[0])) {
      throw new Error('Top level of element tree must not be an array!')
    }
    // End validation

    const elements = inputArray.reduceRight((children, currentLevel, i, arr) => {
      if (Array.isArray(currentLevel)) {
        return currentLevel.map((c) => this.buildLevel(c, children))
      } else {
        return i === 0 ? this.buildLevel(currentLevel, children) : [this.buildLevel(currentLevel, children)]
      }
    }, [])

    return elements
  }

  static buildLevel(elemDef, children) {
    if (!Array.isArray(children)) {
      throw new Error('buildLevel: `children` must be an Array!')
    }
    return {
      ...elemDef,
      children,
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
