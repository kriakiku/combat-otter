import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

rules.push({
  test: /\.vue$/,
  loader: 'vue-loader'
})

rules.push({
  test: /\.scss$/,
  use: [
    'vue-style-loader',
    {
      loader: 'css-loader',
      options: { modules: true }
    },
    'sass-loader'
  ]
})

rules.push({
  test: /\.(jpg|png)$/,
  use: {
    loader: 'url-loader',
  },
})

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
};
