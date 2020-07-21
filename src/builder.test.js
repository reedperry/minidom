import { MiniDOMBuilder } from './builder'

test('should build a plain element with no extra properties', () => {
  const result = MiniDOMBuilder.build('div')
  expect(result.render().tagName.toLowerCase()).toBe('div');
})
