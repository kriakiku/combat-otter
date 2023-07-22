import type { Configuration } from 'webpack';
import { join } from 'node:path'

import { rules } from './webpack.rules';

export const mainConfig: Configuration = {
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
      "@typed": join(__dirname, './src/typed.ts'),
    }
  },
};
