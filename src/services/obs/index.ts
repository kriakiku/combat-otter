import OBSWebSocket, {EventSubscription, OBSWebSocketError} from 'obs-websocket-js';
import { ExponentialStrategy } from 'backoff';
import ipRegex from 'ip-regex';
import log from 'electron-log';
import { InputService } from '@services/typed';
import { config } from '@config';
import { OBSConnectionStatus, OBSCurrentSource, OBSSourceScene, SettingsKeys, TimeoutId } from '@typed';

const connection = new OBSWebSocket();

/**
 * Format connection creds
 */
const AddressRegex = /(?<protocol>^\w+:\/\/)?(?<address>.*)$/;
function formatConnectionCredentials() {
    const ip = config.get(SettingsKeys.OBSServiceConnectionServer) || '127.0.0.1';
    const port = config.get(SettingsKeys.OBSServiceConnectionPort) || 4455;
    const password = config.get(SettingsKeys.OBSServiceConnectionPassword) || '';

    /** Connection url */
    let [, protocol, address] = AddressRegex.exec(ip.trim());

    // Protocol
    if (!protocol) {
        protocol = 'ws://';
    } else {
        protocol = protocol
            .replace('http://', 'ws://')
            .replace('https://', 'wss://');
    }

    // Address
    if (ipRegex.v6({exact: true}).test(address)) {
        address = `[${address}]`;
    }

    address = `${protocol}${address}:${port}`

    return {
        address,
        password: password.trim() || undefined
    }
}

/**
 * OBS service
 */
class OBSService implements InputService {
    private connectionOptions = { eventSubscriptions: EventSubscription.General };
    private enabled = false;
    private reconnectionTimeoutId: TimeoutId | null = null;
    private backoff = new ExponentialStrategy({
        randomisationFactor: Math.random(),
        initialDelay: 700,
        maxDelay: 6000,
        factor: 1.1,
    });

    public connectionStatus: OBSConnectionStatus = {
        type: 'disconnected',
        message: 'There was no connection yet',
        at: Date.now()
    };

    constructor() {
        /** When reconnecting */
        connection.on('ConnectionClosed', (e) => this.connectionErrorHandler(e));

        /** When settings changed */
        config.onDidChange(SettingsKeys.OBSServiceConnectionServer, () => this.whenSettingsChanged());
        config.onDidChange(SettingsKeys.OBSServiceConnectionPort, () => this.whenSettingsChanged());
        config.onDidChange(SettingsKeys.OBSServiceConnectionPassword, () => this.whenSettingsChanged());
    }

    /** Start service */
    public async start() {
        this.enabled = true;
        this.backoff.reset();
        log.scope('services:obs.start').log('starting service');
        void this.connect();
    }

    /** Stop service */
    public async stop() {
        this.enabled = false;
        clearTimeout(this.reconnectionTimeoutId);
        log.scope('services:obs.stop').log('stopping service');
        void this.disconnect();
    }

    /** Connect */
    private async connect() {
        if (!this.enabled) {
            return;
        }

        try {
            clearTimeout(this.reconnectionTimeoutId);
            log.scope('services:obs.connect').log('connecting');
            const { address, password } = formatConnectionCredentials();
            const {
                obsWebSocketVersion,
                negotiatedRpcVersion
            } = await connection.connect(address, password, this.connectionOptions);

            this.backoff.reset();
            const infoMessage = `connected to server "${address}". Version: ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`;
            this.connectionStatus = {
                type: 'connected',
                message: infoMessage,
                at: Date.now()
            }
            log.scope('services:obs.connect').info(infoMessage);
        } catch (reason) {
            log.scope('services:obs.connect').warn(`failed to connect (#${reason?.code || '0000'}): ${reason?.message}`);
            this.connectionErrorHandler(reason);
        }
    }

    /** Disconnect */
    private async disconnect() {
        try {
            this.connectionStatus = {
                type: 'disconnected',
                at: Date.now()
            }

            log.scope('services:obs.disconnect').log('disconnecting');
            await connection.disconnect();
            log.scope('services:obs.disconnect').info('connection terminated successfully');
        } catch (reason) {
            this.connectionStatus = {
                type: 'disconnected',
                message: `[${reason?.code || '-0000'}] ${reason?.message || 'unknown'}`,
                at: Date.now()
            }
            log.scope('services:obs.disconnect').warn(`failed to disconnect from the server (#${reason?.code || '0000'}): ${reason?.message}`);
        }
    }

    /** Reconnection Sub */
    private connectionErrorHandler(error: OBSWebSocketError) {
        log.scope('services:obs.connectionErrorHandler').log(`disconnected (#${error?.code}): ${error?.message}`);
        clearTimeout(this.reconnectionTimeoutId);
        
        this.connectionStatus = {
            type: 'disconnected',
            message: `[${error?.code || '0001'}] ${error?.message || 'unknown'}`,
            at: Date.now()
        }

        if (!this.enabled) {
            return;
        }

        const delay = this.backoff.next();
        log.scope('services:obs.connectionErrorHandler').log(`the reconnection attempt will occur after ${delay}ms`);
        this.reconnectionTimeoutId = setTimeout(() => {
            this.connect();
        }, delay);
    }

    /** Reconnect */
    private whenSettingsChanged() {
        if (!this.enabled) {
            return;
        }

        log.scope('services:obs.whenSettingsChanged').log(`reconnecting due to changed settings`);
        this.backoff.reset();
        this.connect();
    }

    /** Fetch available sources */
    public async fetchSources(): Promise<OBSSourceScene[]> {
        const list: OBSSourceScene[] = [];

        try {
            const { scenes } = await connection.call('GetSceneList');
            const promises: Promise<void>[] = [];

            for (const { sceneName, sceneIndex } of scenes) {
                promises.push((async () => {
                    const { sceneItems } = await connection.call('GetSceneItemList', {
                        sceneName: String(sceneName)
                    });

                    list.push({
                        sceneIndex: Number(sceneIndex),
                        sceneName: String(sceneName),
                        items: sceneItems
                            .filter(item => item.sourceType === 'OBS_SOURCE_TYPE_INPUT')
                            .map(item => ({
                                inputKind: String(item.inputKind),
                                sourceName: String(item.sourceName),
                                sceneItemEnabled: Boolean(item.sceneItemEnabled)
                            }))
                    })
                })())
            }
    
            await Promise.all(promises);
        } catch (reason) {
            log.scope('services:obs.fetchSources').error(`failed to get a list of resources: ${reason?.message}`);
        }

        return list
            .sort((left, right) => right.sceneIndex - left.sceneIndex);
    }

    /** Get current source status */
    public async getCurrentSource(): Promise<OBSCurrentSource> {
        const status: OBSCurrentSource = {
            sceneName: '',
            sourceName: config.get(SettingsKeys.OBSServiceSource),
            status: 'ok'
        }

        // Empty source name
        if (!status.sourceName) {
            status.status = 'not-selected';
            return status;
        }
        try {
            // Current scene
            const { currentProgramSceneName } = await connection.call('GetCurrentProgramScene');
            status.sceneName = currentProgramSceneName;

            // Scene items
            const { sceneItems } = await connection.call('GetSceneItemList', {
                sceneName: currentProgramSceneName
            });

            // Source
            const source = sceneItems.find(item => item.sourceName === status.sourceName);

            if (!source) {
                status.status = 'not-found';
                return status;
            }

            if (!source.sceneItemEnabled) {
                status.status = 'disabled';
                return status;
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const sceneItemTransform = source.sceneItemTransform as any
            if (sceneItemTransform && sceneItemTransform.sourceWidth === 0 && sceneItemTransform.sourceHeight === 0) {
                status.status = 'not-launched';
                return status;
            }

        } catch (reason) {
            status.status = 'unknown';
            status.message = reason?.message;
        }

        return status;
    }

    /** Get input image */
    public async getInput(): Promise<null | Buffer> {
        if (!this.enabled) {
            return null;
        }

        try {
            const sourceName = config.get(SettingsKeys.OBSServiceSource);

            if (!sourceName) {
                throw new Error('The OBS Input Source is not configured');
            }

            const { imageData } = await connection.call('GetSourceScreenshot', {
                sourceName,
                imageFormat: 'png',
                imageHeight: 1080
            });

            return Buffer.from(imageData.replace('data:image/png;base64,', ''), 'base64');
        } catch (reason) {
            log.scope('services:obs.getInput').warn(`failed to capture an source (#${reason?.code || '0000'}): ${reason?.message}`);
        }

        return null;
    }
}

export const obsService = new OBSService();
