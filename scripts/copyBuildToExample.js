const fs = require('fs')

fs.copyFile('dist/bundle.js', 'example/minidom.js', (err) => {
  if (err) {
    throw err
  }
  console.log('minidom.js copied to /example')
})
