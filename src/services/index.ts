import { config } from "@config";
import { screenshotService } from "./screenshot";
import { InputService as InputServiceInterface } from "./typed";
import { SettingsKeys, Services } from "@typed";

class InputService {
    public screenshotService = screenshotService
    public pickedService: InputServiceInterface | null = null;

    constructor() {
        this.whenServiceChanged();
    }

    /** Subscrabe to config changes */
    whenServiceChanged() {
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
                default:
                    this.pickedService = null;
            }

            await this.pickedService?.start();
        }

        config.onDidChange(SettingsKeys.ServiceInputSourceService, handler);
        void handler(currentPickedService);
    }
}

export const inputService = new InputService();
