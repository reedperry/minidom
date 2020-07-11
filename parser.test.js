const Parser = require('./parser')

test('element tag name including dashes', () => {
  expect(Parser.parseSingle('my-custom-element').tagName).toBe('my-custom-element')
})

test('element tag name including dashes and an ID', () => {
  const result = Parser.parseSingle('my-custom-element#my-id')

  expect(result.tagName).toBe('my-custom-element')
  expect(result.id).toBe('my-id')
})

test('single character element tag name', () => {
  const result = Parser.parseSingle('a')

  expect(result.tagName).toBe('a')
  expect(result.id).toBeUndefined()
})

test('element tag name ending in a dash', () => {
  expect(() => {
    Parser.parseSingle('a-')
  }).toThrow(new Error('Invalid element string: Must start with tag name'))
})

test('element tag name ending in a dash with a class', () => {
  expect(() => {
    Parser.parseSingle('a-.this-is-not-cool')
  }).toThrow(new Error('Invalid element string: Must start with tag name'))
})

test('parses a tag name followed by two classes', () => {
  Parser.parseSingle('a.my-class.other-class')
})

test('parses a tag name with a class followed by an attribute', () => {
  Parser.parseSingle('a.my-class[style="testing"]')
})

test('parses a tag name with a single attribute', () => {
  Parser.parseSingle('a[style="testing"]')
})

test('does not include invalid attributes in the output', () => {
  Parser.parseSingle('div[style="testing"][aria-label="some content"][role="alert"]["not"=valid].my-class#my-id')
})

// test('creates an element with one class', () => {
//   expect(Parser.parse('a.my-class')).toEqual({
//     tagName: 'a',
//     classes: ['my-class'],
//     id: undefined,
//     children: []
//   });
// });

// test('sandbox', () => {
//   expect(Parser.parse('a.my-class>div span>p')).toEqual({});
// });

// test('basic sibling', () => {
//   expect(Parser.parse('a.first+a.second')).toEqual({});
// });

// test('siblings nested', () => {
//   expect(Parser.parse('div.parent>a.sibling-link+a.sibling-link')).toEqual({});
// });

// test('sibling with children', () => {
//   expect(Parser.parse('div>a.sib+a.sib-two>div>span.bottom')).toEqual({});
// });

// test('sibling with children including sibling', () => {
//   expect(Parser.parse('div>a.sib+a.sib-two>div>span.bottom+span.bottom-sib')).toEqual({});
// });
