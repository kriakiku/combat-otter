import type { Configuration } from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { join, resolve } from 'node:path'

import { rules } from './webpack.rules';

export const mainConfig: Configuration = {
  cache: false,
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/index.ts',
  // Put your normal webpack config below here
  module: {
    rules,

  },
  // [solve] active-win > node-pre-gyp [deps]
  externals: ['nock', 'mock-aws-s3', 'aws-sdk'],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
    alias: {
      "@backend": join(__dirname, './src/backend'),
      "@config": join(__dirname, './src/config'),
      "@services": join(__dirname, './src/services'),
      "@modules": join(__dirname, './src/modules'),
      "@database": join(__dirname, './src/database'),
      "@typed": join(__dirname, './src/typed.ts'),
    }
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
          {
            from: resolve(__dirname, 'src', 'database', 'migrations'),
            to: resolve(__dirname, '.webpack/main', 'migrations')
          }
      ]
    })
  ]
};
