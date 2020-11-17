# minidom

`minidom` is a small JavaScript library for creating and adding DOM elements to a page.

### Creating Elements

There are two ways to create elements using minidom: `elem` and `build`.
```
import { build, elem } from 'minidom';
```

`elem` is the simplest API, useful when you can describe everything you need using a string similar to a CSS selector.
```javascript
elem('p#intro');                   // <p id="intro"></p>

elem('div.banner');                // <div class="banner"></div>

elem('img[src="/uploads/a.jpg"]'); // <img src="/uploads/a.jpg">
```

`build` is more involved, but provides more flexibility.
```javascript
const square = {
  width: '100px',
  height: '100px',
  display: 'inline-block'
};

const rounded = {
  borderRadius: '10%'
};

const box = md
  .build('div')
  .withStyle(square)
  .withStyle(rounded) // styles can be composed
  .on('mouseenter', function () {
    this.style.opacity = 0.5
  })
  .on('mouseleave', function () {
    this.style.opacity = 1
  })
  .render(); // this returns the final element with the builder properties applied
```
