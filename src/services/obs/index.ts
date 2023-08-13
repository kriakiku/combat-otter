import OBSWebSocket, {EventSubscription, OBSWebSocketError} from 'obs-websocket-js';
import { ExponentialStrategy } from 'backoff';
import ipRegex from 'ip-regex';
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
        console.log('[services:obs:start] starting service');
        void this.connect();
    }

    /** Stop service */
    public async stop() {
        this.enabled = false;
        clearTimeout(this.reconnectionTimeoutId);
        console.log('[services:obs:stop] stopping service');
        void this.disconnect();
    }

    /** Connect */
    private async connect() {
        if (!this.enabled) {
            return;
        }

        try {
            clearTimeout(this.reconnectionTimeoutId);
            console.log('[services:obs:connect] connecting');
            const { address, password } = formatConnectionCredentials();
            const {
                obsWebSocketVersion,
                negotiatedRpcVersion
            } = await connection.connect(address, password, this.connectionOptions);

            this.backoff.reset();
            this.connectionStatus = {
                type: 'connected',
                message: `connected to server "${address}". Version: ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`,
                at: Date.now()
            }
            console.log(`[services:obs:connect] connected to server "${address}". Version: ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`)
        } catch (error) {
            console.error('[services:obs:connect] failed to connect', error?.code, error?.message);
            this.connectionErrorHandler(error);
        }
    }

    /** Disconnect */
    private async disconnect() {
        try {
            this.connectionStatus = {
                type: 'disconnected',
                at: Date.now()
            }

            console.log('[services:obs:disconnect] disconnecting');
            await connection.disconnect();
            console.log('[services:obs:disconnect] connection terminated successfully')
        } catch (error) {
            this.connectionStatus = {
                type: 'disconnected',
                message: `[${error?.code || '-0000'}] ${error?.message || 'unknown'}`,
                at: Date.now()
            }
            console.error('[services:obs:disconnect] failed to disconnect from the server', error?.message)
        }
    }

    /** Reconnection Sub */
    private connectionErrorHandler(error: OBSWebSocketError) {
        console.log('[services:obs:reconnectionSub] disconnected', error?.code, error?.message);
        clearTimeout(this.reconnectionTimeoutId);
        
        this.connectionStatus = {
            type: 'disconnected',
            message: `[${error?.code || '-0001'}] ${error?.message || 'unknown'}`,
            at: Date.now()
        }

        if (!this.enabled) {
            return;
        }

        const delay = this.backoff.next();
        console.log(`[services:obs:reconnectionSub] the reconnection attempt will occur after ${delay}ms`);
        this.reconnectionTimeoutId = setTimeout(() => {
            this.connect();
        }, delay);
    }

    /** Reconnect */
    private whenSettingsChanged() {
        if (!this.enabled) {
            return;
        }

        console.log('[services:obs:whenSettingsChanged] reconnecting due to changed settings');
        this.backoff.reset();
        // TODO: It may be worth closing the previous connection
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
        } catch (e) {
            console.log('[services:obs:fetchSources] failed to get a list of resources', e.message);
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
            console.error('[services:obs:getInput] failed to capture an source', reason?.code, reason?.message)
        }

        return null;
    }
}

export const obsService = new OBSService();
