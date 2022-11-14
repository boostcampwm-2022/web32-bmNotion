import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';

// const dirname = path.resolve();
const dirname = path.resolve(fileURLToPath(import.meta.url));

const config = {
  entry: { index: path.resolve(dirname, '../src', 'Index.tsx') },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(dirname, '../src', 'Index.html'),
    }),
    new NodePolyfillPlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },

  output: {
    filename: 'bundle.js',
    path: path.resolve(dirname, '../dist'),
  },

  stats: {
    children: true,
  },
};

export default config;
