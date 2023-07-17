import { initialize } from './server';

initialize((instance) => {
    instance.get('/test', (_, reply) => {
        reply.send({ hello: 'world' })
    })
})
