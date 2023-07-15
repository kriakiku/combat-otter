import { Writable } from 'node:stream';

/**
 * Stream to buffer
 * TODO: potential memory leak
 */
export function stream2buffer() {
    const stream = new Writable();

    return {
        stream,
        promise: new Promise<Buffer>((resolve, reject) => {
            const buffer: Uint8Array[] = [];

            stream.on("data", (chunk) => buffer.push(chunk));
            stream.on("end", () => resolve(Buffer.concat(buffer)));
            stream.on("error", (err) => reject(err));
        })
    }
}
