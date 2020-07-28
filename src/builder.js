import { parse } from './parser'

export function build(elementString, children = []) {
  const parsedElement = parse(elementString)
  const constructedElement = construct(parsedElement, children)
  return builder(constructedElement)
}

export function render(elemStr, children) {
  const elem = build(elemStr, children).render()
  return elem
}

function construct(elementDefinition, children = []) {
  let element = document.createElement(elementDefinition.tagName)

  addId(elementDefinition, element)
  addClasses(elementDefinition, element)
  addAttributes(elementDefinition, element)

  let currentLevel = element

  for (const child of children) {
    currentLevel = buildLevel(currentLevel, child)
  }

  return element
}

function buildLevel(currentLevel, child) {
  // TODO Rename
  if (doesLevelContainSiblings(currentLevel)) {
    return appendChildrenToAllParents(currentLevel, child)
  } else {
    return appendChildrenToParent(currentLevel, child)
  }
}

function appendChildrenToAllParents(parents, children) {
  if (doesLevelContainSiblings(children)) {
    let newLevel = []
    for (const parent of parents) {
      newLevel = newLevel.concat(appendChildrenToParent(parent, children))
    }
    return newLevel

    // With better variable naming, could this be more readable than the for loop?
    // return parents.reduce((newLevel, parent) => {
    //   return newLevel.concat(appendChildrenToParent(parent, children))
    // }, [])
  } else {
    return parents.map((parent) => parent.appendChild(children.cloneNode()))
  }
}

function appendChildrenToParent(parent, children) {
  if (doesLevelContainSiblings(children)) {
    return children.map((c) => parent.appendChild(c.cloneNode()))
  } else {
    return parent.appendChild(children)
  }
}

function builder(element) {
  return {
    render: () => element,
    // TODO Do we still need bindings at all?
    click: click.bind(null, element),
    on: on.bind(null, element),
    withAttrs: withAttrs.bind(null, element),
    withStyle: withStyle.bind(null, element),
    withText: withText.bind(null, element),
  }
}

function addId(elDef, el) {
  if (elDef.id) {
    el.id = elDef.id
  }
}

function addClasses(elDef, el) {
  if (elDef.classes.length) {
    for (let c of elDef.classes) {
      el.classList.add(c)
    }
  }
}

function addAttributes(elDef, el) {
  if (elDef.attributes) {
    for (let attr of elDef.attributes) {
      el.setAttribute(attr.name, elDef.attributes[attr.value])
    }
  }
}

function click(elem, cb) {
  elem.addEventListener('click', cb)
  return builder(elem)
}

function on(elem, event, cb) {
  elem.addEventListener(event, cb)
  return builder(elem)
}

function withAttrs(elem, attrs) {
  Object.assign(elem, attrs)
  return builder(elem)
}

function withStyle(elem, style) {
  Object.assign(elem.style, style)
  return builder(elem)
}

function withText(elem, text) {
  elem.textContent = text
  return builder(elem)
}

function doesLevelContainSiblings(level) {
  return Array.isArray(level)
}
