import { parse } from './parser'

export class MiniDOMBuilder {
  static build(elementString, children = []) {
    const parsedElement = parse(elementString)
    const constructedElement = this.construct(parsedElement, children)
    return this.builder(constructedElement)
  }

  static render(elemStr, children) {
    const elem = this.build(elemStr, children).render()
    return elem
  }

  static construct(elementDefinition, children = []) {
    let element = document.createElement(elementDefinition.tagName)

    this.addId(elementDefinition, element)
    this.addClasses(elementDefinition, element)
    this.addAttributes(elementDefinition, element)

    let currentLevel = element

    for (const child of children) {
      currentLevel = this.buildLevel(currentLevel, child)
    }

    return element
  }

  static buildLevel(currentLevel, child) {
    if (this.doesLevelContainSiblings(currentLevel)) {
      return this.appendChildrenToAllParents(currentLevel, child)
    } else {
      return this.appendChildrenToParent(currentLevel, child)
    }
  }

  static appendChildrenToAllParents(parents, children) {
    if (this.doesLevelContainSiblings(children)) {
      let newLevel = []
      for (const parent of parents) {
        newLevel = newLevel.concat(this.appendChildrenToParent(parent, children))
      }
      return newLevel

      // With better variable naming, could this be more readable than the for loop?
      // return parents.reduce((newLevel, parent) => {
      //   return newLevel.concat(this.appendChildrenToParent(parent, children))
      // }, [])
    } else {
      return parents.map((parent) => parent.appendChild(children.cloneNode()))
    }
  }

  static appendChildrenToParent(parent, children) {
    if (this.doesLevelContainSiblings(children)) {
      return children.map((c) => parent.appendChild(c.cloneNode()))
    } else {
      return parent.appendChild(children)
    }
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

  static addId(elDef, el) {
    if (elDef.id) {
      el.id = elDef.id
    }
  }

  static addClasses(elDef, el) {
    if (elDef.classes.length) {
      for (let c of elDef.classes) {
        el.classList.add(c)
      }
    }
  }

  static addAttributes(elDef, el) {
    if (elDef.attributes) {
      for (let attr of elDef.attributes) {
        el.setAttribute(attr.name, elDef.attributes[attr.value])
      }
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

  static doesLevelContainSiblings(level) {
    return Array.isArray(level)
  }
}
