import { Writable } from 'node:stream';

/**
 * Stream to buffer
 * TODO: potential memory leak
 */
export function stream2buffer() {
    const buffer: Uint8Array[] = [];
    const stream = new Writable({
        write(chunk, _encoding, callback){
            buffer.push(chunk);
            callback();
        },
    });
    
    return {
        stream,
        promise: new Promise<Buffer>((resolve, reject) => {
            stream.on("data", (chunk) => buffer.push(chunk));
            stream.on("end", () => resolve(Buffer.concat(buffer)));
            stream.on("close", () => resolve(Buffer.concat(buffer)));
            stream.on("error", (err) => reject(err));
        })
    }
}
