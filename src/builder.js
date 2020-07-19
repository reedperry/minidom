import { MiniDOMParser } from './parser';

export class MiniDOMBuilder {

  static render(elemStr, attrs) {
    const elem = this.build(elemStr).render();
    return elem;
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

  static build(...elementStrings) {
    return this.builder(this.construct(MiniDOMParser.parse(elementStrings)));
  }

  static construct(elDef) {
    let el = document.createElement(elDef.tagName);

    if (elDef.id) {
      el.id = elDef.id;
    }

    if (elDef.classes.length) {
      for (let c of elDef.classes) {
        el.classList.add(c);
      }
    }

    if (elDef.attributes) {
      for (let attr in elDef.attributes) {
        el.setAttribute(attr, elDef.attributes[attr]);
      }
    }

    if (elDef.children) {
      for (const child of elDef.children) {
        el.appendChild(DOMBuilder.construct(child));
      }
    }

    return el;
  }

  static buildTree(parentElDef) {

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