import { IncomingMessage, ServerResponse } from 'node:http'
/**
 * Server route
 */
export interface ServerRoute {
    method: 'GET' | 'POST'
    uri: string
    handler: (req: IncomingMessage, res: ServerResponse) => Promise<void> | void
}