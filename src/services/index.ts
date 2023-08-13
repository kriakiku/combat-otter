import { config } from "@config";
import log from 'electron-log';
import { screenshotService } from "./screenshot";
import { InputService as InputServiceInterface } from "./typed";
import { SettingsKeys, Services } from "@typed";
import { obsService } from "./obs";
// import { parseText } from './recognition'


class InputService {
    public screenshotService = screenshotService
    public obsService = obsService;
    public pickedService: InputServiceInterface | null = null;

    constructor() {
        this.whenServiceChanged();
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
            const inputImage = this.pickedService.getInput();
            if (!inputImage) {
                logger.log(`the service returned an empty input`);
                return null;
            }

            // Try to detect 


        } catch (reason) {
            logger.error(`failed to recognize the image. Cause: ${reason?.message}`);
        }

        return null;
    }


    /** Detect: Game type */
    public async detectType() {
        // return await parseText(
        // );
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
