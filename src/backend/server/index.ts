import { app } from 'electron'
import Fastify, { FastifyInstance } from 'fastify'
import { useServerLocalScheme } from './scheme';
import { useServerExternalPort } from './port';

/**
 * Backend initialization
 */
export async function initialize(register: (instance: FastifyInstance) => void) {
    await app.whenReady();

    const instance = Fastify({
        logger: false,
        ignoreTrailingSlash: true
    });

    instance.addHook('onError', (_, reply, error) => {
        reply.send(error);
    });

    register(instance);

    console.log('[Fastify:initialize] Backend initialized');

    /** Local scheme */
    useServerLocalScheme(instance);

    /** External port */
    useServerExternalPort(instance);

}
