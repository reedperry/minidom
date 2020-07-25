import { minidom } from './minidom'

test('should create a single element', () => {
  minidom.create('div#id')
})

test('should build an element with a child', () => {
  minidom.create('div#id', minidom.create('span.class'))
})

test.only('nested test', () => {
  const result = minidom.create(
    'div',
    minidom.create('span'),
    minidom.create('a'),
    minidom.create('p'),
    minidom.create('div'),
    minidom.create('ul'),
    [minidom.create('li'), minidom.create('li')]
  ).render();
  expect(result.outerHTML).toBe('<div><span></span></div>')
})
