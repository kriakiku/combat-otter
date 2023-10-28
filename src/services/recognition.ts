import { app } from 'electron';
import log from 'electron-log';
import TesseractCore from 'tesseract.js-core/tesseract-core-simd';
import { resolve, join } from 'node:path';
import { readFileSync } from 'node:fs';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export let parseText = async (_input: Buffer): Promise<string | null> => {
    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export let parseNumber = async (_input: Buffer): Promise<string | null> => {
    return null;
}

/**
 * Language path
 */
let tessdataEngPath = join('./', '.tessdata', 'eng.traineddata')
if (app.isPackaged) {
    tessdataEngPath = resolve(process.resourcesPath, 'eng.traineddata');
}

/**
 * Initialize recognition
 */
export async function initializeRecognition() {
    try {
        const TessModule = await TesseractCore();
        delete TessModule.then;

        /** Load language */
        const engLanguage = readFileSync(tessdataEngPath);
        TessModule.FS.writeFile('eng.traineddata', engLanguage);

        /** Parser generator */
        const generate = (whitelist?: string) => {
            return (input: Buffer) => {
                let api = null;
                let pointer = null;

                try {
                    /** Format input */
                    pointer = TessModule._malloc(input.length * Uint8Array.BYTES_PER_ELEMENT);
                    TessModule.HEAPU8.set(input, pointer);
                    const pix = TessModule._pixReadMem(pointer, input.length);
            
                    /** Create API request with props */
                    api = new TessModule.TessBaseAPI();
                    api.Init(null, 'eng');
                    // api.SetVariable('user_defined_dpi', '70')
                    if (whitelist) {
                        api.SetVariable('tessedit_char_whitelist', whitelist);
                    }
                    api.SetImage(pix);

                    /** Get recognized text */
                    const text = api.GetUTF8Text();
            
                    return text;
                } catch (reason) {
                    log.scope('services:recognition.parse').error(`parsing error: ${reason?.message}`);
                    return null;
                } finally {
                    /** Garbage collector */
                    if (api) {
                        api.End();
                        TessModule.destroy(api);
                    }

                    if (pointer) {
                        TessModule._free(pointer);
                    }
                }
            }
        }

        parseText = generate('RANKED PLYMWZO|:-'); // ABCDEFGHIJKLMNOPQRSTUVWXYZ
        parseNumber = generate();
        
    } catch (reason) {
        log.scope('services:recognition').error(`initialization error: ${reason?.message}`)
        throw reason;
    }
}
