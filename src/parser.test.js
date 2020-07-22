import { MiniDOMParser } from './parser'

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

test('does not accept an element tag name ending in a dash', () => {
  expect(() => {
    MiniDOMParser.parseSingle('a-')
  }).toThrow(new Error('Invalid element string: Must start with tag name'))
})

test('does not accept an element tag name ending in a dash followed by a class', () => {
  expect(() => {
    MiniDOMParser.parseSingle('a-.this-is-not-cool')
  }).toThrow(new Error('Invalid element string: Must start with tag name'))
})

test('parses a tag name followed by two classes', () => {
  expect(MiniDOMParser.parseSingle('a.my-class.other-class')).toEqual({
    tagName: 'a',
    classes: ['my-class', 'other-class'],
    id: undefined,
    attributes: [],
    children: [],
  })
})

test('parses a tag name with a class followed by an attribute', () => {
  expect(MiniDOMParser.parseSingle('div.my-class[style="testing"]')).toEqual({
    tagName: 'div',
    classes: ['my-class'],
    id: undefined,
    attributes: [{ name: 'style', value: 'testing' }],
    children: [],
  })
})

test('parses a tag name with attributes', () => {
  expect(MiniDOMParser.parseSingle('p[role="test-role"][attr="value"]')).toEqual({
    tagName: 'p',
    classes: [],
    id: undefined,
    attributes: [
      { name: 'role', value: 'test-role' },
      { name: 'attr', value: 'value' },
    ],
    children: [],
  })
})

test('parses a tag name with an attribute followed by a class', () => {
  expect(MiniDOMParser.parseSingle('span[attr="first"].class-at-end')).toEqual({
    tagName: 'span',
    classes: ['class-at-end'],
    id: undefined,
    attributes: [{ name: 'attr', value: 'first' }],
    children: [],
  })
})

test('does not include invalid attributes in the output', () => {
  expect(
    MiniDOMParser.parseSingle(
      'div[style="testing"][aria-label="some content"][role="alert"]["not"=valid].my-class#my-id'
    )
  ).toEqual({
    tagName: 'div',
    classes: ['my-class'],
    id: 'my-id',
    attributes: [
      { name: 'style', value: 'testing' },
      { name: 'aria-label', value: 'some content' },
      { name: 'role', value: 'alert' },
    ],
    children: [],
  })
})

test('creates an element with one class and an ID', () => {
  expect(MiniDOMParser.parseSingle('a#main-link.my-class')).toEqual({
    tagName: 'a',
    classes: ['my-class'],
    id: 'main-link',
    attributes: [],
    children: [],
  })
})
