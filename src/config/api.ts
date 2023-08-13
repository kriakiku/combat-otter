import { app, ipcMain, IpcMainEvent, WebContents } from 'electron'
import log from 'electron-log';
import { store } from './migrations';
import { SettingsKeys } from '@typed';

/** Subscribers */
const updateSubscribers: WebContents[] = [];
const updateSubscribe = (event: IpcMainEvent) => {
    updateSubscribers.push(event.sender);
    event.reply('settings:updated', store.store);
}
const updateHandler = (_: IpcMainEvent, key: SettingsKeys, value: unknown) => {
    try {
        const prevValue = store.get(key);
        if (prevValue === value) {
            log.scope('config:api.update').log(`settings "${key}" has no changes ${JSON.stringify(value)}`);
            return
        }

        store.set(key, value);
        log.scope('config:api.update').log(`settings "${key}" updated ${JSON.stringify(prevValue)} => ${JSON.stringify(value)}`);
    } catch (reason) {
        log.scope('config:api.update').error(`failed to update setting "${key}": ${reason?.message}`);
    }
}
const resetHandler = (event: IpcMainEvent, key: SettingsKeys) => {
    try {
        store.reset(key);
        event.reply('settings:updated', store.store);
        log.scope('config:api.reset').log(`settings "${key}" restored`);
    } catch (reason) {
        log.scope('config:api.reset').error(`failed to restore setting "${key}": ${reason?.message}`);
    }
}

/** 
 * Subscriptions (ipc)
 * TODO: delete on unsubscribe
 */
ipcMain.on('settings:subscribe', updateSubscribe);
ipcMain.on('settings:update', updateHandler);
ipcMain.on('settings:reset', resetHandler);

/**
 * Subscription (config)
 */
const unsubscribe = store.onDidAnyChange((config) => {
    log.scope('config:api.onDidAnyChange').log(`settings updated`);
    for (const event of updateSubscribers) {
        try {
            event.send('settings:updated', config)
        } catch (reason) {
            log.scope('config:api.onDidAnyChange').error(`cant send settings update notification: ${reason?.message}`);
        }
    }
});

app.on('before-quit', () => {
    log.scope('config:api.before-quit').log(`unsubscribe`);
    ipcMain.off('settings:subscribe', updateSubscribe);
    ipcMain.off('settings:update', updateHandler);
    unsubscribe();
});