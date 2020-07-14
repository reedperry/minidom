
module.exports = class MiniDOMBuilder {

  static render(elemStr, attrs) {
    const elem = this.build(elemStr).render();
    if (attrs) {
      for (let attr in attrs) {
        elem.setAttribute(attr, attrs[attr]);
      }
    }
    return elem;
  }

  static construct(elemDef) {
    if (Array.isArray(elemDef)) {
      throw new Error('Not ready for this yet...');
    }

    let elem = doc.createElement(elemDef.tagName);

    if (elemDef.classes.length) {
      for (let c of elemDef.classes) {
        elem.classList.add(c);
      }
    }

    if (elemDef.id) {
      elem.id = elemDef.id;
    }

    if (elemDef.children) {
      for (const child of elemDef.children) {
        elem.appendChild(DOMBuilder.construct(child));
      }
    }

    return elem;
  }

  static build(elemStr) {
    return this.builder(this.construct(MiniDOMParser.parse(elemStr)));
  }

  static buildTree(elemDef) {

  }


  static builder(elem) {
    return {
      render: () => elem,
      click: DOM.click.bind(DOM, elem),
      on: DOM.on.bind(DOM, elem),
      withAttrs: DOM.withAttrs.bind(DOM, elem),
      withStyle: DOM.withStyle.bind(DOM, elem),
      withText: DOM.withText.bind(DOM, elem)
    };
  }

  static click(elem, cb) {
    elem.addEventListener('click', cb);
    return DOM.builder(elem);
  }

  static on(elem, event, cb) {
    elem.addEventListener(event, cb);
    return DOM.builder(elem);
  }

  static withAttrs(elem, attrs) {
    Object.assign(elem, attrs);
    return DOM.builder(elem);
  }

  static withStyle(elem, style) {
    Object.assign(elem.style, style);
    return DOM.builder(elem);
  }

  static withText(elem, text) {
    elem.textContent = text;
    return DOM.builder(elem);
  }
}