'use strict';

export class DOMBuilder {
  // Maybe shouldn't be a static methods API?
  doc = window.document;

  static render(elemStr, attrs) {
    const elem = DOMBuilder.build(elemStr).render();
    if (attrs) {
      for (let attr in attrs) {
        elem.setAttribute(attr, attrs[attr]);
      }
    }
    return elem;
  }


  static construct(elemDef) {
    // Not supported yet...
    if (Array.isArray(elemDef)) {
      return DOMBuilder.construct(elemDef[0]);
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
    return DOMBuilder.builder(DOMBuilder.construct(ElementParser.parse(elemStr)));
  }
}

export class ElementMounter {
  defaultTarget = document.body;

  static setDefaultTarget(target) {
    this.defaultTarget = target;
  }

  /**
   * Replace the contents of a target element with a child element
   * @param el The element to mount
   * @param [target] The target element to mount an element to. Defaults to ElementMounter.defaultTarget.
   */
  static replace(el, target = this.defaultTarget) {
    target.innerHTML = '';
    this.append(el, target);
  }

  /**
   * Append an element as a child of target element
   * @param el The element to append
   * @param [target] The target element to append the new element to. Defaults to ElementMounter.defaultTarget.
   */
  static append(el, target = this.defaultTarget) {
    target.appendChild(el);
  }

}

// Maybe?
export function minidom(query) {
  return new DOMBuilder(query);
}

// All private
class ElementParser {

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
        return [DOM.parseSingle(str, children)];
      }, []);
    }

    return DOM.parseSingle(elemStr);
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

/**
 * Class for building elements and mounting them in the document
 */
class DOM {

  // Does this stuff all move to Builder?
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

const blue = {
  background: 'navy'
};
const green = {
  background: 'darkgreen'
};
const red = {
  background: 'darkred'
};
const yellow = {
  background: 'yellow'
};
const gray = {
  background: 'gray'
};

const transition = {
  transition: 'background-color .25s ease-in',
  '-webkit-transition': 'background-color .25s ease-in'
};
const tall = {
  height: '200px',
  width: '100px',
  display: 'inline-block',
  margin: '2px'
};
const wide = {
  height: '100px',
  width: '200px',
  display: 'inline-block',
  margin: '2px'
};
const square = {
  height: '150px',
  width: '150px',
  display: 'inline-block',
  margin: 0,
  padding: 0
};

const app = DOM.render('div#app');

const header = DOM.build('div.header')
  .withStyle({ backgroundColor: 'lightgray' })
  .render();

const attrs = {
  href: 'http://google.com',
  target: '_blank'
};

const linkStyle = {
  margin: '5px',
  display: 'inline-block'
};

const links = ['Home', 'About', 'Archive'].map(function(text) {
  const linkContainer = DOM.build('div.link').withStyle(linkStyle).render();
  DOM.mount(
    DOM.build('a').withText(text).withAttrs(attrs).render(),
    linkContainer
  );
  return linkContainer;
});

links.forEach(function(link) {
  DOM.mount(link, header);
});

DOM.mount(header, app);

const spaced = {
  margin: '5px'
};

const container = DOM.render('div#container');
const colors = [blue, green, red, yellow, gray];
for (let i = 0; i < 5; i++) {
  const box = DOM.build('div')
    .withStyle(colors[i])
    .withStyle(square)
    .withStyle(spaced)
    .on('mouseenter', function() {
      this.style.opacity = 0.3;
    })
    .on('mouseleave', function() {
      this.style.opacity = 1;
    })
    .render();

  DOM.mount(box, container);
}

DOM.mount(container, app);

// const els = []
// for (let i = 0; i < 40; i++) {
//   els.push(
//     DOM.build('div.disco')
//       .withStyle(square)
//       .withStyle(transition)
//       .withStyle(red)
//       // .withText('Reed')
//       .render()
//   )
// }
// els.forEach(el => app.appendChild(el))

DOM.mount(app);

// const styles = [red, blue, green, yellow, gray]

// window.setInterval(() => {
//   const divs = document.querySelectorAll('div.disco')
//   for (let d of divs) {
//     Object.assign(
//       d.style,
//       styles[Math.floor(Math.random() * styles.length)],
//       transition
//     )
//   }
// }, 250)
