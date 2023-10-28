import { config } from "@config";
import log from 'electron-log';
import { Readable } from 'stream';
import { screenshotService } from "./screenshot";
import { InputService as InputServiceInterface } from "./typed";
import { SettingsKeys, Services, GameType } from "@typed";
import { obsService } from "./obs";
import { ffmpeg } from '@modules/ffmpeg';
import { stream2buffer } from "./helpers";
import { parseNumber, parseText } from "./recognition";
import {writeFileSync} from 'node:fs'

class InputService {
    public screenshotService = screenshotService
    public obsService = obsService;
    public pickedService: InputServiceInterface | null = null;

    constructor() {
        this.whenServiceChanged();

        setInterval(() => this.parse(), 3000)
    }

    /**
     * Parse
     */
    public async parse(): Promise<null> {
        const logger = log.scope('services:parse');

        try {
            if (!this.pickedService) {
                logger.log(`the service is not selected`);
                return null;
            }

            // Fetch image
            const inputImage = await this.pickedService.getInput();
            if (!inputImage) {
                logger.log(`the service returned an empty input`);
                return null;
            }
            writeFileSync(`./test_input.png`, inputImage);


            // // Detect: Game Type
            // const areaModeImg = await this.cropImage(inputImage, SettingsKeys.ServiceGridAreaMode);
            // const gameType = await this.detectType(areaModeImg);

            // Detect: Rank
            const rankImg = await this.cropImage(inputImage, SettingsKeys.ServiceGridAreaRank);
            const rank = await this.detectInteger(rankImg);
            console.log('rank', rank);

            // Detect: SR
            const srImg = await this.cropImage(inputImage, SettingsKeys.ServiceGridAreaSR);
            const sr = await this.detectInteger(srImg);
            console.log('sr', sr);

            // Detect: Level
            const levelImg = await this.cropImage(inputImage, SettingsKeys.ServiceGridAreaLevel);
            const level = await this.detectInteger(levelImg);
            console.log('level', level);

            // console.log({
            //     gameType,
            //     rank,
            //     sr,
            //     level
            // })


        } catch (reason) {
            logger.error(`failed to recognize the image. Cause: ${reason?.message}`);
        }

        return null;
    }

    /** Crop image */
    private async cropImage(
        input: Buffer,
        areaKey: SettingsKeys.ServiceGridAreaMode | SettingsKeys.ServiceGridAreaRank | SettingsKeys.ServiceGridAreaSR | SettingsKeys.ServiceGridAreaLevel
    ): Promise<Buffer> {
        const area = config.get(areaKey);
        const crop = [
            `${(area.width / area.canvas.width).toFixed(4)}*in_w`,
            `${(area.height / area.canvas.height).toFixed(4)}*in_h`,
            `${(area.x / area.canvas.width).toFixed(4)}*in_w`,
            `${(area.y / area.canvas.height).toFixed(4)}*in_h`,
        ].join(':')

        const { stream, promise } = stream2buffer();
        ffmpeg()
            .input(Readable.from(input))
            .videoFilters([`crop=${crop}`, 'format=pal8', 'eq=contrast=2:gamma_r=0.3:gamma_g=0.3:gamma_b=0.3:saturation=0', 'lutyuv=y=negval:u=negval:v=negval' ])
            .outputFormat('mjpeg')
            .output(stream)
            .on('error', (reason) => {
                // TODO: Potential memory leak
                if (!reason.message?.includes('Output stream closed')) {
                    log.scope('services:cropImage').error(`crop processing error: ${reason?.message}`)
                }
            })
            .run()

        const buffer = await promise;
        writeFileSync(`./test_${areaKey}.png`, buffer);
        return buffer;
    }


    /**
     * Detect: Game type
     * TODO: Make a smarter error tolerance system
     */
    public async detectType(input: Buffer): Promise<GameType | null> {
        const text = String(await parseText(input)).toLowerCase();

        /** Ranked detect */
        if (
            !(text.includes('anked') || text.includes('ranke'))
            || !(text.includes('lay') || text.includes('pla'))
        ) {
            return null;
        }

        /** Warzone */
        if (text.includes('warzone')) {
            return GameType.WZ;
        }

        /** MW / TODO: need to be improved */
        return GameType.MW;
    }

    /**
     * Detect: Integer
     */
    public async detectInteger(input: Buffer): Promise<number | null> {
        const raw = String(await parseNumber(input));
        // const value = Number(raw);

        // if (!raw || String(value) !== raw || isNaN(value)) {
        //     return null;
        // }

        return raw;
    }

    /**
     * Subscribe to config changes
     */
    private whenServiceChanged() {
        const currentPickedService = config.get(SettingsKeys.ServiceInputSourceService);
        const handler = async (newValue: Services, oldValue?: Services) => {
            if (oldValue === newValue) {
                return;
            }

            await this.pickedService?.stop();

            switch (newValue) {
                case Services.screenshot:
                    this.pickedService = this.screenshotService;
                    break;
                case Services.obs:
                    this.pickedService = this.obsService;
                // default:
                //     this.pickedService = null;
            }

            await this.pickedService?.start();
        }

        config.onDidChange(SettingsKeys.ServiceInputSourceService, handler);
        void handler(currentPickedService);
    }
}

export const inputService = new InputService();
