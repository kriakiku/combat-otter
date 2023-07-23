import { screenshotServiceEndpoints } from './handlers/screenshot-service';
import { initialize } from './server';

const endpoints = [
    ...screenshotServiceEndpoints
]

initialize((instance) => {
    for (const endpoint of endpoints) {
        instance.get(endpoint.path, endpoint.handler)
    }

    instance.get('/ping', async (_, reply) => {
        reply.send(
            'ok'
        )
    })
})
