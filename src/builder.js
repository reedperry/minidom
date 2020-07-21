import { MiniDOMParser } from './parser';

export class MiniDOMBuilder {

  static render(elemStr, attrs) {
    const elem = this.build(elemStr).render();
    return elem;
  }

  static builder(element) {
    return {
      render: () => element,
      click: MiniDOMBuilder.click.bind(MiniDOMBuilder, element),
      on: MiniDOMBuilder.on.bind(MiniDOMBuilder, element),
      withAttrs: MiniDOMBuilder.withAttrs.bind(MiniDOMBuilder, element),
      withStyle: MiniDOMBuilder.withStyle.bind(MiniDOMBuilder, element),
      withText: MiniDOMBuilder.withText.bind(MiniDOMBuilder, element)
    };
  }

  static build(elementString) {
    return this.builder(this.construct(MiniDOMParser.parseSingle(elementString)));
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
        el.appendChild(MiniDOMBuilder.construct(child));
      }
    }

    return el;
  }

  static buildTree(parentElDef) {

  }

  static click(elem, cb) {
    elem.addEventListener('click', cb);
    return MiniDOMBuilder.builder(elem);
  }

  static on(elem, event, cb) {
    elem.addEventListener(event, cb);
    return MiniDOMBuilder.builder(elem);
  }

  static withAttrs(elem, attrs) {
    Object.assign(elem, attrs);
    return MiniDOMBuilder.builder(elem);
  }

  static withStyle(elem, style) {
    Object.assign(elem.style, style);
    return MiniDOMBuilder.builder(elem);
  }

  static withText(elem, text) {
    elem.textContent = text;
    return MiniDOMBuilder.builder(elem);
  }
}