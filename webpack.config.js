var webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    devtool: 'source-map',
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules\/(?!qs)/,
          loader: 'babel',
          query: {
            presets: ['es2015', 'stage-0']
          }
        }
      ]
    },
    output: {
        libraryTarget: 'umd',
        library: 'mobservable-model',
        filename: 'lib/index.js'
    }
}