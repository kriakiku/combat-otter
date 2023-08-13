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
let languagePath = join('./', '.tessdata', 'eng.traineddata')
if (app.isPackaged) {
    languagePath = resolve(process.resourcesPath, 'eng.traineddata');
}

/**
 * Initialize recognition
 */
export async function initializeRecognition() {
    try {
        const TessModule = await TesseractCore();
        delete TessModule.then;

        /** Load language */
        const engLanguage = readFileSync(languagePath);
        TessModule.FS.writeFile('eng.traineddata', engLanguage);

        /** Parser generator */
        const generate = (whitelist?: string) => {
            return (input: Buffer) => {
                try {
                    /** Format input */
                    const pointer = TessModule._malloc(input.length * Uint8Array.BYTES_PER_ELEMENT);
                    TessModule.HEAPU8.set(input, pointer);
                    const pix = TessModule._pixReadMem(pointer, input.length);
            
                    /** Create API request with props */
                    const api = new TessModule.TessBaseAPI();
                    api.Init(null, 'eng');
                    if (whitelist) {
                        api.SetVariable('tessedit_char_whitelist', whitelist);
                    }
                    api.SetImage(pix);

                    /** Get recognized text */
                    const text = api.GetUTF8Text();
            
                    /** Garbage collector */
                    api.End();
                    TessModule.destroy(api);
                    TessModule._free(pointer);

                    return text;
                } catch (reason) {
                    log.scope('services:recognition.parse').error(`parsing error: ${reason?.message}`);
                    return null;
                }
            }
        }

        parseText = generate();
        parseNumber = generate('0123456789');
        
    } catch (reason) {
        log.scope('services:recognition').error(`initialization error: ${reason?.message}`)
        throw reason;
    }
}
