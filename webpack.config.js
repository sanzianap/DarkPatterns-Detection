// webpack.config.js
const path = require('path');

module.exports = {
  entry: './scripts/cookie_detection.js',
  output: {
    filename: 'content.bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
