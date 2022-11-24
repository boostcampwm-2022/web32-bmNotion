import commonConfig from './webpack.config.js';
import { merge } from 'webpack-merge';

const config = merge(commonConfig, {
  mode: 'development',

  devtool: 'source-map',

  devServer: {
    port: 3000,
    historyApiFallback: true,
    proxy: {
      '/': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});

export default config;
