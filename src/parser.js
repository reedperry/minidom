const validTagName = /^[a-zA-Z]+(?:[-a-zA-Z][a-zA-Z]+)*$/
const elementPartsSplit = /(\[.*?\])|([#\.][_a-zA-Z0-9-]+)/
const classMatch = /^[_a-zA-Z0-9-]+$/
const roughAttributeMatch = /(\[.*\])/
const attributeMatch = /^\[.+=(?:"|').+(?:"|')\]$/

const isTruthy = (x) => !!x

export class MiniDOMParser {
  static parse(inputArray) {
    // Start validation
    if (!Array.isArray(inputArray)) {
      throw new Error('Invalid element string: Empty/missing')
    }

    if (inputArray.length === 0) {
      return []
    }

    if (Array.isArray(inputArray[0])) {
      throw new Error('Top level of element tree must not be an array!')
    }

    // TODO Should we allow this?
    if (typeof inputArray === 'string') {
      return this.parseSingle(inputArray)
    }

    // End validation

    const elements = inputArray.reduceRight((children, current, i, arr) => {
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

  static parseSingle(input) {
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

    let id = parts.find(this.isId)
    if (id) {
      id = id.substring(1)
    }

    const classes = parts.filter((p) => this.isClass(p) && p.substring(1).match(classMatch)).map((p) => p.substring(1))

    const attributes = this.parseAttributes(parts)

    return {
      children: [],
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
      if (__DEV__) {
        console.warn('No attribute string passed to parseAttribute')
      }
      return null
    }

    if (!attrString.match(attributeMatch)) {
      if (__DEV__) {
        console.warn(`Invalid attribute string passed to parseAttribute: ${attrString}`)
      }
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

  static isClass(part) {
    return !!part && part.startsWith('.')
  }

  static isId(part) {
    return !!part && part.startsWith('#')
  }
}
