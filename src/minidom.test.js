import { minidom } from './minidom'

describe('minidom', () => {
  test('should create a single element', () => {
    const result = minidom.create('div#id')

    expect(result.tagName.toLowerCase()).toBe('div')
    expect(result.id).toBe('id')
  })

  test('should build an element with a child', () => {
    const result = minidom.create('div#id', minidom.create('span.class'))

    expect(result.outerHTML).toBe('<div id="id"><span class="class"></span></div>')
  })

  test('should create an element tree with sibling elements at only the lowest level', () => {
    const result = minidom.create('div#top', minidom.create('div#middle'), [
      minidom.create('a#bottom-left'),
      minidom.create('a#bottom-right'),
    ])
    expect(result.outerHTML).toBe(
      '<div id="top"><div id="middle"><a id="bottom-left"></a><a id="bottom-right"></a></div></div>'
    )
  })

  test('should create an element tree with sibling elements in one middle level of the tree', () => {
    const result = minidom.create(
      'div#top',
      [minidom.create('div#middle-1'), minidom.create('div#middle-2')],
      minidom.create('span.will-appear-twice')
    )
    expect(result.outerHTML).toBe(
      '<div id="top"><div id="middle-1"><span class="will-appear-twice"></span></div><div id="middle-2"><span class="will-appear-twice"></span></div></div>'
    )
  })

  test('should create an element tree containing consecutive levels with sibling elements', () => {
    const result = minidom.create(
      'div',
      minidom.create('span'),
      minidom.create('a'),
      minidom.create('p'),
      minidom.create('div'),
      [minidom.create('ul#list-one'), minidom.create('ul#list-two')],
      [minidom.create('li'), minidom.create('li')]
    )
    expect(result.outerHTML).toBe(
      '<div><span><a><p><div><ul id="list-one"><li></li><li></li></ul><ul id="list-two"><li></li><li></li></ul></div></p></a></span></div>'
    )
  })
})
