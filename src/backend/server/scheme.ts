import { protocol } from 'electron'
import { FastifyInstance, InjectOptions } from 'fastify'

const BACKEND_SCHEME = 'backend'
protocol.registerSchemesAsPrivileged([{
    scheme: BACKEND_SCHEME,
    privileges: {
        standard: false,
        secure: true,
        supportFetchAPI: true
    }
}])

/**
 * For locale frontend usage
 */
export function useServerLocalScheme(server: FastifyInstance) {
    protocol.handle(BACKEND_SCHEME, async ({ method, headers, body, url }) => {
        try {
            const response = await server.inject({
                url: `${url.replace(`${BACKEND_SCHEME}://`, "")}`,
                method: method as InjectOptions['method'],
                headers: headers as unknown as InjectOptions['headers'],
                body: body as InjectOptions['body']
            })
    
            return new Response(
                response.rawPayload,
                {
                    headers: response.headers as unknown as Response['headers'],
                    status: response.statusCode,
                    statusText: response.statusMessage
                }
            )
        } catch (e) {
            return new Response(
                JSON.stringify({
                    error: e ? e.message : 'unknown error'
                }),
                {
                    headers: { 'content-type': 'application/json' },
                    status: 500,
                    statusText: 'Internal Server Error'
                }
            )
        }
    })

    console.log(`[Fastify:local-scheme] Backend started at ${BACKEND_SCHEME}:// local scheme`);
}
