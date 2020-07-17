const validTagName = /^[a-zA-Z]+(?:[-a-zA-Z][a-zA-Z]+)*$/
const elementPartsSplit = /(\[.*?\])|([#\.][_a-zA-Z0-9-]+)/
const classMatch = /^[_a-zA-Z0-9-]+$/
const roughAttributeMatch = /(\[.*\])/
const attributeMatch = /^\[.+=(?:"|').+(?:"|')\]$/

const isTruthy = (x) => !!x

module.exports = class MiniDOMParser {

  static parse(elemStrArray) {
    if (!Array.isArray(elemStrArray)) {
      throw new Error('Invalid element string: Empty/missing')
    }

    if (elemStrArray.length === 0) {
      return []
    }

    if (Array.isArray(elemStrArray[0])) {
      throw new Error('Not supported, handle this');
    }

    if (typeof elemStrArray === 'string') {
      return this.parseSingle(elemStrArray)
    }

    const elements = elemStrArray.reduceRight((children, current, i, arr) => {
      if (Array.isArray(current)) {
        return current.map((c) => this.buildLevel(c, children))
      } else {
        return i === 0 ? this.buildLevel(current, children) : [this.buildLevel(current, children)]
      }
    }, [])

    return elements
  }

  static buildLevel(elemStr, children) {
    if (!Array.isArray(children)) {
      throw new Error('buildLevel: `children` must be an Array!')
    }
    return {
      ...this.parseSingle(elemStr),
      children,
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
