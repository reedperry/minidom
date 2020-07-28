/**
 * Mount the contents of an element into a target element. This replaces any 
 * existing contents in the target element.
 * @param el The element to mount
 * @param target The target element to mount an element to.
 */
export function mount(el, target) {
  target.innerHTML = ''
  append(el, target)
}

/**
 * Append an element as a child of target element
 * @param el The element to append
 * @param target The target element to append the new element to.
 */
export function append(el, target) {
  if (Array.isArray(el)) {
    // TODO Verify that there's no valid case where this would happen
    throw new Error('Cannot append multiple elements to a target element!')
    el.forEach((e) => {
      target.appendChild(e)
    })
  } else {
    target.appendChild(el)
  }
}
