import { parse } from './parser'

export function build(elementString, children = []) {
  const parsedElement = parse(elementString)
  const constructedElement = construct(parsedElement, children)
  return builder(constructedElement)
}

export function elem(elemStr, ...children) {
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
  if (areSiblingsPresent(currentLevel)) {
    return appendChildrenToAllParents(currentLevel, child)
  } else {
    return appendChildrenToParent(currentLevel, child)
  }
}

function appendChildrenToAllParents(parents, children) {
  if (areSiblingsPresent(children)) {
    let newLevel = []
    parents.forEach(parent => {
      newLevel = newLevel.concat(appendChildrenToParent(parent, children))
    })
    return newLevel
  } else {
    return parents.map((parent) => parent.appendChild(children.cloneNode()))
  }
}

function appendChildrenToParent(parent, children) {
  if (areSiblingsPresent(children)) {
    return children.map((c) => parent.appendChild(c.cloneNode()))
  } else {
    return parent.appendChild(children)
  }
}

function builder(element) {
  return {
    render: () => element,
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

function areSiblingsPresent(level) {
  return Array.isArray(level)
}
