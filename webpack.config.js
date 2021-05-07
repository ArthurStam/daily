const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV,
  devtool: false,
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash:8].js',
  },
  module: {
    rules: [{
      test: /\.tsx$/, use: 'babel-loader', exclude: /node_modules/
    }, {
      test: /\.css$/, use: ['style-loader', 'css-loader'],
    }],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
};
