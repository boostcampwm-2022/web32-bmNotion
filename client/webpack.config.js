import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
import RefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
// const dirname = path.resolve();
const dirname = path.resolve(fileURLToPath(import.meta.url));

const config = {
  entry: { index: path.resolve(dirname, '../src', 'Index.tsx') },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(dirname, '../src', 'Index.html'),
      favicon: './public/assets/favicon/favicon-16x16.png',
    }),
    new NodePolyfillPlugin(),
    new CopyWebpackPlugin({ patterns: [{ from: './public/assets', to: './assets' }] }),
    new RefreshWebpackPlugin(),
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
    alias: {
      '@': path.resolve(dirname, '../src'),
    },
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },

  output: {
    filename: 'bundle.js',
    path: path.resolve(dirname, '../dist'),
    publicPath: '/',
  },

  stats: {
    children: true,
  },
};

export default config;
