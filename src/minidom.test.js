import { build, md } from './index'

describe('minidom', () => {
  test('should create a single element', () => {
    const result = md('div#id')

    expect(result.tagName.toLowerCase()).toBe('div')
    expect(result.id).toBe('id')
  })

  test('should build an element with a child', () => {
    const result = md('div#id', md('span.class'))

    expect(result.outerHTML).toBe('<div id="id"><span class="class"></span></div>')
  })

  test('should create an element tree with sibling elements at only the lowest level', () => {
    const result = md('div#top', md('div#middle'), [
      md('a#bottom-left'),
      md('a#bottom-right'),
    ])
    expect(result.outerHTML).toBe(
      '<div id="top"><div id="middle"><a id="bottom-left"></a><a id="bottom-right"></a></div></div>'
    )
  })

  test('should create an element tree with sibling elements in one middle level of the tree', () => {
    const result = md(
      'div#top',
      [md('div#middle-1'), md('div#middle-2')],
      md('span.will-appear-twice')
    )
    expect(result.outerHTML).toBe(
      '<div id="top"><div id="middle-1"><span class="will-appear-twice"></span></div><div id="middle-2"><span class="will-appear-twice"></span></div></div>'
    )
  })

  test('should create an element tree containing consecutive levels with sibling elements', () => {
    const result = md(
      'div',
      md('span'),
      md('a'),
      md('p'),
      md('div'),
      [md('ul#list-one'), md('ul#list-two')],
      [md('li'), md('li')]
    )
    expect(result.outerHTML).toBe(
      '<div><span><a><p><div><ul id="list-one"><li></li><li></li></ul><ul id="list-two"><li></li><li></li></ul></div></p></a></span></div>'
    )
  })
})
