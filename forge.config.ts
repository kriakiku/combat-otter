import { join } from 'node:path'
import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import FFmpegStatic from "ffmpeg-static-electron-forge";

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    extraResource: [
      "src/database/migrations"
    ]
  },
  rebuildConfig: {},
  makers: [new MakerSquirrel({}), new MakerZIP({}, ['darwin']), new MakerRpm({}), new MakerDeb({})],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      devContentSecurityPolicy: `default-src 'self' 'unsafe-inline' data: blob: backend:; script-src 'self' 'unsafe-eval' 'unsafe-inline' data: blob: backend:`,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/frontend/assets/index.html',
            js: './src/frontend/app.ts',
            name: 'main_window',
            preload: {
              js: './src/preload.ts',
            },
          },
        ],
      },
    }),
    new FFmpegStatic({
      remove: true,
      path: join(__dirname, ".webpack", "main"),
    }),
  ],
};

export default config;
