import { FastifyHandler } from "@backend/typed";
import { getSourceList, connectionStatus } from "@services/obs";

export const obsServiceEndpoints: Array<FastifyHandler<void>> = [
    // Connection status
    {
        path: '/service/obs/connection-status',
        handler: async (_, reply) => {
            const status = await connectionStatus();
            reply.send(status);
        }
    },
    // Source list
    {
        path: '/services/obs/source-list',
        handler: async (_, reply) => {
            const list = await getSourceList();
            reply.send(list);
        }
    }
]
