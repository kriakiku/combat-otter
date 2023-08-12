import { session } from 'electron'
import { join } from 'node:path'
import { readdirSync } from 'node:fs'
import { homedir } from 'node:os'

/**
 * Vue devtools
 * https://devtools.vuejs.org/guide/installation.html#chrome
 * https://www.electronjs.org/docs/latest/tutorial/devtools-extension
 */
export async function initPlugins(isProd: boolean) {
    if (!isProd) {
        const pluginPath = join(
            homedir(),
            'AppData/Local/Google/Chrome/User Data/Default/Extensions/nhdogjmejiglipccpnnnanhbledajbpd'
        );
        
        const version = readdirSync(pluginPath)[0];

        await session.defaultSession.loadExtension(join(pluginPath, version))
    }
}
