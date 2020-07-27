/**
 * Replace the contents of a target element with a child element
 * @param el The element to mount
 * @param [target] The target element to mount an element to.
 */
export function replace(el, target) {
  target.innerHTML = ''
  this.append(el, target)
}

/**
 * Append an element as a child of target element
 * @param el The element to append
 * @param [target] The target element to append the new element to.
 */
export function append(el, target) {
  if (Array.isArray(el)) {
    el.forEach((e) => {
      target.appendChild(e)
    })
  } else {
    target.appendChild(el)
  }
}
