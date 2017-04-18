var webpack = require('webpack');
var path = require('path');

module.exports = {
  devtool: "source-map",
  entry: [
    './build/app/index.js'
  ],
  output: {
    filename: 'app.js',
    publicPath: '/js',
    path: path.resolve('dist')
  },
  resolve: {
    extensions: ['', '.ts', '.tsx', '.js', '.jsx'],
    modulesDirectories: ['build/app', 'node_modules'],
  },
  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
    "jquery": "jQuery",
    "bootstrap" : "Bootstrap"
  },
};