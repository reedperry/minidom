'use strict';

const doc = window.document;

/**
 * Class for building elements and mounting them in the document
 */
class DOM {
  /**
   * Mount an element as a child of target element
   * @param el The element to mount
   * @param [target] The target element to mount an element to. Defaults. to document.body
   * @param [replace] If true, replace the content of target with el. Otherwise,
   * append el to the existing content of target. Defaults to false.
   */
  static mount(el, target = document.body, replace = false) {
    if (replace) {
      target.innerHTML = '';
    }
    target.appendChild(el);
  }

  static render(tagName, attrs) {
    const elem = this.build(tagName).render();
    if (attrs) {
      for (let attr in attrs) {
        elem.setAttribute(attr, attrs[attr]);
      }
    }
    return elem;
  }

  static build(tagName) {
    let id, classes = [], dividers = [], targets = ['#', '.'];

    let idx = 0;
    for (let char of tagName) {
      if (targets.indexOf(char) > -1) {
        dividers.push(idx);
      }
      idx++;
    }

    dividers.sort((a, b) => a - b);

    for (let [idx, d] of dividers.entries()) {
      let symbol = tagName[d];
      if (DOM.isClass(symbol)) {
        if (dividers.length > idx + 1) {
          classes.push(tagName.substring(d + 1, dividers[idx + 1]));
        } else {
          classes.push(tagName.substring(d + 1));
        }
      } else if (DOM.isId(symbol)) {
        if (dividers.length > idx + 1) {
          id = tagName.substring(d + 1, dividers[idx + 1]);
        } else {
          id = tagName.substring(d + 1);
        }
      }
    }

    // Determine actual plain tag name
    if (dividers.length) {
      tagName = tagName.substring(0, dividers[0]);
    }

    let elem = doc.createElement(tagName);

    if (classes.length) {
      for (let c of classes) {
        elem.classList.add(c);
      }
    }

    if (id) {
      elem.id = id;
    }

    return this.builder(elem);
  }

  static isClass(divider) {
    return divider === '.';
  }

  static isId(divider) {
    return divider === '#';
  }

  static builder(elem) {
    return {
      render: () => elem,
      click: this.click.bind(this, elem),
      on: this.on.bind(this, elem),
      withAttrs: this.withAttrs.bind(this, elem),
      withStyle: this.withStyle.bind(this, elem),
      withText: this.withText.bind(this, elem)
    };
  }

  static click(elem, cb) {
    elem.addEventListener('click', cb);
    return this.builder(elem);
  }

  static on(elem, event, cb) {
    elem.addEventListener(event, cb);
    return this.builder(elem);
  }

  static withAttrs(elem, attrs) {
    Object.assign(elem, attrs);
    return this.builder(elem);
  }

  static withStyle(elem, style) {
    Object.assign(elem.style, style);
    return this.builder(elem);
  }

  static withText(elem, text) {
    elem.textContent = text;
    return this.builder(elem);
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
