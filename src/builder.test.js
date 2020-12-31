import { build } from './builder'

test('should build a plain element with no extra properties', () => {
  const result = build('div')
  expect(result.render().tagName.toLowerCase()).toBe('div')
})

test('should build an element with an id', () => {
  const id = 'my-id'
  const result = build(`div#${id}`)
  expect(result.render().id).toBe(id)
})

test('should build an element with attributes, classes, and an id', () => {
  const result = build('span.class1.class2[attr1="one"]#my-id[attr2="two"]')
  const element = result.render()
  expect(element.id).toBe('my-id')
  expect(element.classList.contains('class1')).toBe(true)
  expect(element.classList.contains('class2')).toBe(true)
})
