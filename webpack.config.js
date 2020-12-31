module.exports = {
  mode: 'development',
  output: {
    library: 'md',
    libraryTarget: 'umd',
    filename: 'minidom.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },
    ],
  },
}
