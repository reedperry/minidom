const validTagName = /^[a-zA-Z]+(?:[-a-zA-Z][a-zA-Z]+)*$/
const elementListSplit = /(?:\s|>)/
const elementPartsSplit = /(\[.*?\])|([#\.][_a-zA-Z0-9-]+)/
const classMatch = /^[_a-zA-Z0-9-]+$/
const roughAttributeMatch = /(\[.*\])/
const attributeMatch = /^\[.+=(?:"|').+(?:"|')\]$/

const isTruthy = (x) => !!x

// TODO Handling for multiplying?
module.exports = class MiniDOMParser {
  static parse(elemStr) {
    if (!elemStr) {
      throw new Error('Invalid element string: Empty/missing')
    }

    let elements = elemStr.split(elementListSplit).map((el) => el.trim())

    if (elements.length === 1) {
      return this.parseSingle(elemStr)
    } else if (elements.length > 1) {
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].includes('+')) {
          elements[i] = elements[i].split('+')
        }
      }

      return elements.reduce((tree, currentElement) => {
        if (tree) {
          // Find the deepest (by depth), and then furthest to the 'right' if there are siblings
          let deepestElement = tree
          while (deepestElement.children.length) {
            deepestElement = deepestElement.children[deepestElement.children.length - 1]
          }

          if (!Array.isArray(currentElement)) {
            deepestElement.children.push(this.parseSingle(currentElement))
          } else {
            currentElement.forEach((childInSiblingGroup) =>
              deepestElement.children.push(this.parseSingle(childInSiblingGroup))
            )
          }
          return tree
        }

        return this.parseSingle(currentElement)
      }, null)
    }
  }

  static parseSingle(input, children = []) {
    if (!input) {
      throw new Error('Invalid element string: Empty/missing')
    }

    let parts = input.split(elementPartsSplit).filter(isTruthy)

    const tagName = parts[0] || null
    const tagNameMatch = !!tagName && tagName.match(validTagName)
    if (!tagNameMatch || tagNameMatch.index !== 0) {
      // TODO Define elsewhere
      throw new Error('Invalid element string: Must start with tag name')
    }

    // Discard tag name from parts list
    parts.shift()

    let id = parts.find((p) => p.startsWith('#'))
    if (id) {
      id = id.substring(1)
    }

    const classes = parts
      .filter((p) => p.startsWith('.') && p.substring(1).match(classMatch))
      .map((p) => p.substring(1))

    const attributes = this.parseAttributes(parts)

    console.log('Input:', input)
    console.table({
      children,
      classes,
      attributes,
      id,
      tagName,
    })

    return {
      children,
      classes,
      attributes,
      id,
      tagName,
    }
  }

  static parseAttributes(inputParts) {
    const attributes = []
    for (const part of inputParts) {
      if (part.match(roughAttributeMatch)) {
        const attribute = this.parseAttribute(part)
        if (attribute) {
          attributes.push(attribute)
        }
      }
    }
    return attributes
  }

  static parseAttribute(attrString) {
    if (!attrString) {
      return null
    }

    if (!attrString.match(attributeMatch)) {
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

  static isClass(divider) {
    return divider === '.'
  }

  static isId(divider) {
    return divider === '#'
  }
}