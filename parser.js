
// TODO Handling for children/siblings/grouping
module.exports = class MiniDOMParser {

  static parse(elemStr) {
    if (!elemStr) {
      throw new Error('Invalid element string: Empty/missing');
    }

    let elements = elemStr.split('>');
    if (elements.length > 1) {
      // Future...
      for (const e of elements) {
        if (e.includes('+')) {
          console.log('sibling elements:', e.split('+'));
        }
      }

      return elements.reduceRight((children, str, i) => {
        return [this.parseSingle(str, children)];
      }, []);
    }

    return this.parseSingle(elemStr);
  }

  static parseSingle(elemStr, children = []) {
    if (!elemStr) {
      throw new Error('Invalid element string: Empty/missing');
    }

    let parts = elemStr.split(/([#\.][_a-zA-Z0-9-]+)/).filter(p => !!p);

    if (parts[0].match(/[a-zA-Z]/).index !== 0) {
      throw new Error('Invalid element string: Must start with tag name');
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
      id,
      tagName
    };
  }

  static isClass(divider) {
    return divider === '.';
  }

  static isId(divider) {
    return divider === '#';
  }

}
