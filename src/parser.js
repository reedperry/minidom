const validTagName = /^[a-zA-Z]+(?:[-a-zA-Z][a-zA-Z]+)*$/
const elementPartsSplit = /(\[.*?\])|([#\.][_a-zA-Z0-9-]+)/
const classMatch = /^[_a-zA-Z0-9-]+$/
const roughAttributeMatch = /(\[.*\])/
const attributeMatch = /^\[.+=(?:"|').+(?:"|')\]$/

const isTruthy = (x) => !!x

export function parse(input) {
  if (!input) {
    throw new Error('Invalid element string: Empty/missing')
  }

  let parts = input.split(elementPartsSplit).filter(isTruthy)

  const tagName = parseTagName(parts)
  parts = removeTagNamePart(parts)
  const id = parseId(parts)
  const classes = parseClasses(parts)
  const attributes = parseAttributes(parts)

  return {
    tagName,
    id,
    classes,
    attributes,
  }
}

function parseTagName(inputParts) {
  const tagName = inputParts[0] || null
  const tagNameMatch = !!tagName && tagName.match(validTagName)
  if (!tagNameMatch || tagNameMatch.index !== 0) {
    throw new Error('Invalid element string: Must start with tag name')
  }
  return tagName
}

function removeTagNamePart(inputParts) {
  return inputParts.slice(1)
}

function parseId(inputParts) {
  let id = inputParts.find(isId)
  if (id) {
    return removeFirstCharacter(id)
  } else {
    return undefined
  }
}

function parseClasses(inputParts) {
  return inputParts.filter(isValidClassName).map(removeFirstCharacter)
}

function parseAttributes(inputParts) {
  const attributes = []
  for (const part of inputParts) {
    if (part.match(roughAttributeMatch)) {
      const attribute = parseAttribute(part)
      if (attribute) {
        attributes.push(attribute)
      }
    }
  }
  return attributes
}

function parseAttribute(attrString) {
  if (!attrString || !attrString.match(attributeMatch)) {
    return null
  }

  const strippedAttrString = attrString.substring(1, attrString.length - 1)

  const [name, rawValue] = strippedAttrString.split('=')
  if (!name || !rawValue) {
    return null
  }

  const value = rawValue.substring(1, rawValue.length - 1)

  return {
    name,
    value,
  }
}

function isValidClassName(input) {
  return isClass(input) && input.substring(1).match(classMatch)
}

function isClass(part) {
  return !!part && part.startsWith('.')
}

function isId(part) {
  return !!part && part.startsWith('#')
}

function removeFirstCharacter(input) {
  return input.substring(1)
}
