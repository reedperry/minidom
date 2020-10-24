import { elem } from './index'

describe('minidom', () => {
  test('should create a single element', () => {
    const result = elem('div#id')

    expect(result.tagName.toLowerCase()).toBe('div')
    expect(result.id).toBe('id')
  })

  test('should build an element with a child', () => {
    const result = elem('div#id', elem('span.class'))

    expect(result.outerHTML).toBe('<div id="id"><span class="class"></span></div>')
  })

  test('should create an element tree with sibling elements at only the lowest level', () => {
    const result = elem('div#top', elem('div#middle'), [
      elem('a#bottom-left'),
      elem('a#bottom-right'),
    ])
    expect(result.outerHTML).toBe(
      '<div id="top"><div id="middle"><a id="bottom-left"></a><a id="bottom-right"></a></div></div>'
    )
  })

  test('should create an element tree with sibling elements in one middle level of the tree', () => {
    const result = elem(
      'div#top',
      [elem('div#middle-1'), elem('div#middle-2')],
      elem('span.will-appear-twice')
    )
    expect(result.outerHTML).toBe(
      '<div id="top"><div id="middle-1"><span class="will-appear-twice"></span></div><div id="middle-2"><span class="will-appear-twice"></span></div></div>'
    )
  })

  test('should create an element tree containing consecutive levels with sibling elements', () => {
    const result = elem(
      'div',
      elem('span'),
      elem('a'),
      elem('p'),
      elem('div'),
      [elem('ul#list-one'), elem('ul#list-two')],
      [elem('li'), elem('li')]
    )
    expect(result.outerHTML).toBe(
      '<div><span><a><p><div><ul id="list-one"><li></li><li></li></ul><ul id="list-two"><li></li><li></li></ul></div></p></a></span></div>'
    )
  })
})
