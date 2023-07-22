import { getActiveWindowList } from '@services/screenshot';
import { initialize } from './server';

initialize((instance) => {
    instance.get('/test', async (_, reply) => {
        reply.send(
            await getActiveWindowList()
        )
    })
})
