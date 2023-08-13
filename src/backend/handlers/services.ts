import { join } from 'node:path'
import { existsSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { app } from "electron";
import { FastifyHandler } from "@backend/typed";
import { inputService } from "@services/index";
import { ffprobe } from '@modules/ffmpeg';

/** Success captured area image path */
const CAPTURED_IMAGE_PATH = join(app.getPath('userData'), 'captured-image.dat');

export const servicesEndpoints: Array<FastifyHandler<void>> = [
    /**
     * Endpoint for getting and updating preview image for area customization
     */
    {
        path: '/services/area-input',
        handler: async (request, reply) => {
            const needToCapture = 'capture' in (request.query as object)

            // Need to capture
            if (needToCapture) {
                const input = await inputService.pickedService.getInput();

                if (input !== null) {
                    writeFileSync(CAPTURED_IMAGE_PATH, input);
                }
            }

            // Image not exists
            if (!existsSync(CAPTURED_IMAGE_PATH)) {
                reply.status(404);
                reply.send();
                return;
            }

            // Get image meta
            try {
                const meta = await new Promise((resolve, reject) => {
                    ffprobe(CAPTURED_IMAGE_PATH, (err, data) => {
                        if (err) {
                            reject(err);
                            return;
                        }
    
                        resolve(data);
                    });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                }) as any;

                const format = String(meta.streams[0].codec_name);
                const width = Number(meta.streams[0].width);
                const height = Number(meta.streams[0].height);
                const modify = statSync(CAPTURED_IMAGE_PATH).mtimeMs;

                const image = readFileSync(CAPTURED_IMAGE_PATH);

                reply.type(`image/${format}`);
                reply.header('cache-control', 'no-cache no-store no-transform')
                reply.header('x-image-width', width);
                reply.header('x-image-height', height);
                reply.header('x-image-modify', modify);
                reply.send(image);
            } catch (reason) {
                console.error('[api:/services/area-input] Failed to get images meta information', reason);
                reply.status(404);
                reply.send();
                return;
            }
        }
    }
]
