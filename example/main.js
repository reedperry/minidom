'use strict';

//import { minidom as md } from '../minidom';

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

const app = md.create('div#app');

const header = md.build('div.header')
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
  const linkContainer = md.build('div.link').withStyle(linkStyle).render();
  md.append(
    md.build('a').withText(text).withAttrs(attrs).render(),
    linkContainer
  );
  return linkContainer;
});

links.forEach(function(link) {
  md.append(link, header);
});

md.append(header, app);

const spaced = {
  margin: '5px'
};

const container = md.create('div#container');
const colors = [blue, green, red, yellow, gray];
for (let i = 0; i < 5; i++) {
  const box = md.build('div')
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

  md.append(box, container);
}

md.append(container, app);

// const els = []
// for (let i = 0; i < 40; i++) {
//   els.push(
//     md.build('div.disco')
//       .withStyle(square)
//       .withStyle(transition)
//       .withStyle(red)
//       // .withText('Reed')
//       .render()
//   )
// }
// els.forEach(el => app.appendChild(el))

md.mount(app, document.body);

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
