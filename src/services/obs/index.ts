import { InputService } from '@services/typed';
// import OBSWebSocket, {EventSubscription} from 'obs-websocket-js';
// import { config } from '../../config';

// const obs = new OBSWebSocket();

/**
 * OBS service
 */
class OBSService implements InputService {

    /** Start service */
    public start() {
        console.log('[services:obs:start] Starting service');
    }

    /** Stop service */
    public stop() {
        console.log('[services:obs:stop] Stopping service');
    }

    /** Get input image */
    public async getInput() {
        return Promise.resolve(null);
    }
}

export const obsService = new OBSService();


// /** Connect to server */
// async function connect() {
//     // Already connected
//     if (obs.identified) {
//         return;
//     }

//     const address = `${config.services.obs.address}:${config.services.obs.port}`;
//     const password = config.services.obs.password;
//     const options = { eventSubscriptions: EventSubscription.None };

//     try {
//         const {
//             obsWebSocketVersion,
//             negotiatedRpcVersion
//         } = await obs.connect(address, password, options);

//         console.log(`[OBS] Connected to server ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`)
//     } catch (error) {
//         console.error('[OBS] Failed to connect', error.code, error.message);
//     }
// }

// /** Disconnect from server */
// export async function disconnect() {
//     try {
//         await obs.disconnect();
//         console.log('[OBS]', 'Connection terminated successfully')
//     } catch (e) {
//         console.error('[OBS]', 'Failed to disconnect from the server')
//     }
// }

// /**
//  * Get current scene, to make screenshot
//  */
// async function getCurrentScene(): Promise<string | null> {
//     try {
//         const sceneName = await obs.call('GetCurrentProgramScene')
    
//         if (!sceneName?.currentProgramSceneName) {
//             throw new Error("Cant get active scene name")
//         }

//         console.log('[OBS]', `Current scene name "${sceneName.currentProgramSceneName}"`)
//         return sceneName.currentProgramSceneName;
//     } catch (e) {
//         console.error('[OBS]', e);
//         return null;
//     }
// }

// /**
//  * Get input
//  */
// export async function getInput(): Promise<Buffer | null> {
//     // Connect to server
//     await connect();

//     // Get current scene name
//     const sceneName = await getCurrentScene();
//     if (!sceneName) {
//         return null;
//     }

//     // Request image
//     try {
//         const data = await obs.call('GetSourceScreenshot', {
//             sourceName: sceneName,
//             imageFormat: 'png',
//         });

//         if (!data.imageData) {
//             throw new Error('Preview image not generated');
//         }

//         return Buffer.from(data.imageData, "base64");
//     } catch (e) {
//         console.error('[OBS]', e);
//         return null;
//     }
// }