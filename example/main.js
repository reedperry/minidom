'use strict'

const blue = {
  background: 'navy',
}
const green = {
  background: 'darkgreen',
}
const red = {
  background: 'darkred',
}
const yellow = {
  background: 'yellow',
}
const gray = {
  background: 'gray',
}

const transition = {
  transition: 'background-color 0.75s',
  '-webkit-transition': 'background-color 0.75s',
}

const square = {
  height: '150px',
  width: '150px',
  display: 'inline-block',
  margin: 0,
  padding: 0,
}

const smallSquare = {
  height: '20px',
  width: '20px',
  display: 'inline-block',
  margin: 0,
  padding: 0,
}

const app = md.elem('div#app')

const header = md.build('div.header').withStyle({ backgroundColor: '#ddd' }).render()

const linkData = [
  { name: 'MDN', href: 'https://developer.mozilla.org' },
  { name: 'minidom', href: 'https://github.com/reedperry/minidom' },
  { name: 'Spotify', href: 'https://open.spotify.com' },
]

const linkAttrs = {
  target: '_blank',
}

const linkStyle = {
  fontSize: '1.6rem',
  margin: '0.75rem',
  display: 'inline-block',
}

const links = linkData.map(function (linkDefinition) {
  const linkContainer = md.build('div.link').withStyle(linkStyle).render()
  md.append(
    md
      .build('a')
      .withText(linkDefinition.name)
      .withAttrs({
        ...linkAttrs,
        href: linkDefinition.href,
      })
      .render(),
    linkContainer
  )
  return linkContainer
})

links.forEach(function (link) {
  md.append(link, header)
})

md.append(header, app)

const spaced = {
  margin: '10px',
}

const container = md.elem('div#container')
const colors = [blue, green, red, yellow, gray]
for (let i = 0; i < 5; i++) {
  const box = md
    .build('div')
    .withStyle(colors[i])
    .withStyle(square)
    .withStyle(spaced)
    .on('mouseenter', function () {
      this.style.opacity = 0.4
    })
    .on('mouseleave', function () {
      this.style.opacity = 1
    })
    .render()

  md.append(box, container)
}

md.append(container, app)

const els = []
for (let i = 0; i < 40; i++) {
  els.push(md.build('div.disco').withStyle(smallSquare).withStyle(transition).withStyle(red).render())
}
els.forEach((el) => md.append(el, app))

md.mount(app, document.body)

const styles = [red, blue, green, yellow, gray]

let intervalId = md.everyMs(1000, (i) => {
  const divs = document.querySelectorAll('div.disco')
  for (let d of divs) {
    Object.assign(d.style, styles[Math.floor(Math.random() * styles.length)], transition)
  }
  if (i > 15) {
    clearInterval(intervalId)
  }
})
