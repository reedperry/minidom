import { MiniDOMParser } from './parser';

test('element tag name including dashes', () => {
  expect(MiniDOMParser.parseSingle('my-custom-element').tagName).toBe('my-custom-element')
})

test('element tag name including dashes and an ID', () => {
  const result = MiniDOMParser.parseSingle('my-custom-element#my-id')

  expect(result.tagName).toBe('my-custom-element')
  expect(result.id).toBe('my-id')
})

test('single character element tag name', () => {
  const result = MiniDOMParser.parseSingle('a')

  expect(result.tagName).toBe('a')
  expect(result.id).toBeUndefined()
})

test('element tag name ending in a dash', () => {
  expect(() => {
    MiniDOMParser.parseSingle('a-')
  }).toThrow(new Error('Invalid element string: Must start with tag name'))
})

test('element tag name ending in a dash with a class', () => {
  expect(() => {
    MiniDOMParser.parseSingle('a-.this-is-not-cool')
  }).toThrow(new Error('Invalid element string: Must start with tag name'))
})

test('parses a tag name followed by two classes', () => {
  MiniDOMParser.parseSingle('a.my-class.other-class')
})

test('parses a tag name with a class followed by an attribute', () => {
  MiniDOMParser.parseSingle('a.my-class[style="testing"]')
})

test('parses a tag name with a single attribute', () => {
  MiniDOMParser.parseSingle('a[style="testing"]')
})

test('does not include invalid attributes in the output', () => {
  MiniDOMParser.parseSingle('div[style="testing"][aria-label="some content"][role="alert"]["not"=valid].my-class#my-id')
})

test('creates an element with one class and an ID', () => {
  expect(MiniDOMParser.parse(['a#main-link.my-class'])).toEqual({
    tagName: 'a',
    classes: ['my-class'],
    id: 'main-link',
    attributes: [],
    children: [],
  })
})

// Start questionable API...

test('creates an element with one child', () => {
  expect(MiniDOMParser.parse(['div', 'span'])).toEqual({
    tagName: 'div',
    classes: [],
    id: undefined,
    attributes: [],
    children: [
      {
        tagName: 'span',
        classes: [],
        id: undefined,
        attributes: [],
        children: [],
      },
    ],
  })
})

test('creates an element with two children as siblings', () => {
  expect(MiniDOMParser.parse(['div', ['span.child-one', 'span.child-two']])).toEqual({
    tagName: 'div',
    classes: [],
    id: undefined,
    attributes: [],
    children: [
      {
        tagName: 'span',
        classes: ['child-one'],
        id: undefined,
        attributes: [],
        children: [],
      },
      {
        tagName: 'span',
        classes: ['child-two'],
        id: undefined,
        attributes: [],
        children: [],
      },
    ],
  })
})

test('creates an element with a child, which has two siblings as children', () => {
  expect(MiniDOMParser.parse(['div#grandparent', 'div#parent', ['div#my-div', 'span']])).toEqual({
    tagName: 'div',
    classes: [],
    id: 'grandparent',
    attributes: [],
    children: [
      {
        tagName: 'div',
        classes: [],
        id: 'parent',
        attributes: [],
        children: [
          {
            tagName: 'div',
            classes: [],
            id: 'my-div',
            attributes: [],
            children: [],
          },
          {
            tagName: 'span',
            classes: [],
            id: undefined,
            attributes: [],
            children: [],
          },
        ],
      },
    ],
  })
})

test('does not allow an array of elements to be the top level of a tree', () => {
  expect(() => MiniDOMParser.parse([['div.parent-one', 'div.parent-two'], 'div.child'])).toThrow()
})

// End questionable API...
