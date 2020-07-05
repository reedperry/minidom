module.exports = class MiniDOMMounter {
  defaultTarget = document.body;

  static setDefaultTarget(target) {
    this.defaultTarget = target;
  }

  /**
   * Replace the contents of a target element with a child element
   * @param el The element to mount
   * @param [target] The target element to mount an element to. Defaults to ElementMounter.defaultTarget.
   */
  static replace(el, target = this.defaultTarget) {
    target.innerHTML = '';
    this.append(el, target);
  }

  /**
   * Append an element as a child of target element
   * @param el The element to append
   * @param [target] The target element to append the new element to. Defaults to ElementMounter.defaultTarget.
   */
  static append(el, target = this.defaultTarget) {
    target.appendChild(el);
  }
}
