import { FastifyHandler } from "@backend/typed";
import { getActiveWindowList } from "@services/screenshot";

export const screenshotServiceEndpoints: Array<FastifyHandler<void>> = [
    // Window list
    {
        path: '/services/screenshot/window-list',
        handler: async (_, reply) => {
            const list = await getActiveWindowList();
            reply.send(list);
        }
    }
]
