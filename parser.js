
const elementSplit = /(?:\s|>)/;
const roughAttributeMatch = /(\[.*\])/;
const attributeMatch = /(\[.+=".+"\])/;

// TODO Handling for children/siblings/grouping
module.exports = class MiniDOMParser {

  static parse(elemStr) {
    if (!elemStr) {
      throw new Error('Invalid element string: Empty/missing');
    }

    let elements = elemStr.split(elementSplit).map(el => el.trim());

    //let elements = elemStr.split('>');
    if (elements.length > 1) {
      // Future...
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].includes('+')) {
          elements[i] = elements[i].split('+');
        }
      }

        return elements.reduce((tree, currentElement) => {
          if (tree) {
            if (!Array.isArray(currentElement)) {
              tree.children.push(this.parseSingle(currentElement));
            } else {
              // FIXME Tree setup is really not implemented yet...
              tree.children.push(this.parseSingle(currentElement[0]));
            }
            return tree;
          }

          return this.parseSingle(currentElement);
        }, null);
    }

    return this.parseSingle(elemStr);
  }

  static parseSingle(elemStr, children = []) {
    if (!elemStr) {
      throw new Error('Invalid element string: Empty/missing');
    }

    let parts = elemStr.split(/(\[.*?\])|([#\.][_a-zA-Z0-9-]+)/).filter(p => !!p);

    if (parts[0].match(/[a-zA-Z]/).index !== 0) {
      throw new Error('Invalid element string: Must start with tag name');
    }

    const attributes = [];
    for (const part of parts) {
      if (part.match(roughAttributeMatch)) {
        const attribute = this.parseAttribute(part);
        if (attribute) {
          attributes.push(attribute);
        }
      }
    }

    const tagName = parts.shift().match(/[a-zA-Z]+/)[0];
    let id = parts.find(p => p.startsWith('#'));
    if (id) {
      id = id.substring(1);
    }
    const classes = parts
      .filter(p => p.startsWith('.') && p.substring(1).match(/[_a-zA-Z0-9-]/))
      .map(p => p.substring(1));

    return {
      children,
      classes,
      attributes,
      id,
      tagName
    };
  }

  static parseAttribute(attrString) {
    if (!attrString) {
      return null;
    }

    if (!attrString.match(attributeMatch)) {
      return null;
    }

    const strippedAttrString = attrString.substring(1, attrString.length - 1);

    const [name, rawValue] = strippedAttrString.split('=');
    if (!name || !rawValue) {
      return null;
    }

    const value = rawValue.substring(1, rawValue.length - 1);

    console.log({
      name,
      value
    });

    return {
      name,
      value
    };
  }

  static isClass(divider) {
    return divider === '.';
  }

  static isId(divider) {
    return divider === '#';
  }

}
