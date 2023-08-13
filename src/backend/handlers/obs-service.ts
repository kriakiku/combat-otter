import { FastifyHandler } from "@backend/typed";
import { obsService } from "@services/obs";

export const obsServiceEndpoints: Array<FastifyHandler<void>> = [
    // Connection status
    {
        path: '/service/obs/connection-status',
        handler: async (_, reply) => {
            reply.send(obsService.connectionStatus);
        }
    },
    // Source list
    {
        path: '/service/obs/source-list',
        handler: async (_, reply) => {
            const list = await obsService.fetchSources();
            reply.send(list);
        }
    },
    // Current source
    {
        path: '/service/obs/current-source',
        handler: async (_, reply) => {
            const info = await obsService.getCurrentSource();
            reply.send(info);
        }
    }
]
