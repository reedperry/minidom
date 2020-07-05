'use strict';

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
