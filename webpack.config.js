const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    background: './src/background/background.js',
    content: './src/content/content.js',
    preview: './src/content/preview.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
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
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'preview.html',
      template: "./src/content/preview.html",
      chunks: ['preview'],
    }),
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      template: "./src/popup/popup.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/assets", to: "assets" },
        { from: "manifest.json", to: "manifest.json" },
      ]
    }),
  ],
  devtool: 'source-map',
  mode: 'development',
};
