// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import { SettingsStore } from '@typed'

const api = {
  setSettings: <K extends keyof SettingsStore>(key: K, value: SettingsStore[K]) => {
    ipcRenderer.send('settings:update', key, value)
  },
  resetSettings: <K extends keyof SettingsStore>(key: K) => {
    ipcRenderer.send('settings:reset', key)
  },
  subscribeSettings: (handler: (config: SettingsStore) => void) => {
    const subscriber = (_: IpcRendererEvent, config: SettingsStore) => {
      handler(config);
    }

    const unsubscribe = () => {
      ipcRenderer.off('settings:updated', subscriber);  
    }

    ipcRenderer.send('settings:subscribe')
    ipcRenderer.on('settings:updated', subscriber)

    return unsubscribe
  }
}

contextBridge.exposeInMainWorld('api', api)

export type ApiInterface = typeof api;