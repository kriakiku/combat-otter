import { app } from 'electron'
import log from 'electron-log';
import { FastifyInstance } from 'fastify'
import { config } from '@config/index';
import { SettingsKeys } from '@typed';
import getPort from 'get-port';

const DEFAULT_PORT = 1337;
const DISABLED = true;

/**
 * For external usage
 * TODO: Some kind of Hogwarts again. Need to live restart the server when changing the port 🤮
 * TODO: Fastify cant reopen a connection on the same port
 */
export function useServerExternalPort(server: FastifyInstance) {
    if (DISABLED) {
        return;
    }

    let currentListener: null | (() => void) = null;
    let latestPort: number = DEFAULT_PORT;

    /**
     * Close fastify port
     */
    const closePort = async (reason: string) => {
        if (currentListener) {
            await server.close();
            currentListener = null;
            log.scope('backend:external').info(`backend listener stopped. Reason: ${reason}`);
        }
    }

    /**
     * Start server handler
     */
    const startServer = async () => {
        const isEnabled = config.get(SettingsKeys.BackendEnabled);
        const userPort = config.get(SettingsKeys.BackendPort);

        // Server disabled by user
        if (!isEnabled && currentListener) {
            await closePort('Disabled by user');
            return;
        }

        // Server not launched and not needed
        if (!isEnabled) {
            log.scope('backend:external').log('backend server not needed');
            return;
        }

        // User port can be replaced by latest used port
        if (userPort === null) {
            const availablePort = await getPort({
                port: userPort || latestPort
            })

            config.set(SettingsKeys.BackendPort, availablePort);
            log.scope('backend:external').info(`backend port changed to ${availablePort}`);
            return;
        }

        // Port changed
        if (userPort !== latestPort && currentListener) {
            await closePort('Port switched');
        }

        // Need to start server
        await new Promise<void>(resolve => {
            currentListener = ((err: Error, address: string) => {
                if (err) {
                    config.set(SettingsKeys.BackendEnabled, false);
                    closePort(`Unable to start server on ${userPort} port`)
                        .then(resolve);
                    return
                }

                log.scope('backend:external').info(`server is now listening on ${address}`);
                latestPort = userPort
                resolve();
            }) as typeof currentListener

            server.listen({
                port: userPort
            }, currentListener);
        })
    }


    /** Server configuration changes callback */
    let currentPromise: Promise<void> | null = null;
    let needToRelaunch = false;

    const thenCallback = () => {
        currentPromise = null;
        if (needToRelaunch) {
            needToRelaunch = false;
            startServer()
                .then(thenCallback);
        }
    }

    const callback = () => {
        needToRelaunch = true;
    
        if (!currentPromise) {
            thenCallback();
        }
    }

    config.onDidChange(SettingsKeys.BackendPort, callback)
    config.onDidChange(SettingsKeys.BackendEnabled, callback)
    callback();

    app.on('before-quit', async () => {
        if (currentListener) {
            await server.close();
        }
    })
}
