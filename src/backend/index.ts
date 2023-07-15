import Fastify from 'fastify'
import '../services/obs'
import { config } from '../config'
import * as serviceHandlers from './handlers/services'

const fastify = Fastify({
    logger: config.backend.logger
})

fastify.addHook('onError', (_, reply, error) => {
    reply.send(error);
})

// Services
for (const {path, handler} of Object.values(serviceHandlers)) {
    fastify.get(path, handler);
}

fastify.get('/', (_, reply) => {
    reply.send({ hello: 'world' })
})

fastify.listen({ port: config.backend.port }, (err, address) => {
    if (err) {
        throw err
    }

    console.log(`Server is now listening on ${address}`)
})