import { FastifyHandler } from "@backend/typed";
import { inputService } from "@services/index";

export const servicesEndpoints: Array<FastifyHandler<void>> = [
    // Current input
    {
        path: '/services/get-input',
        handler: async (_, reply) => {
            const input = await inputService.pickedService.getInput();

            if (input === null) {
                reply.status(404);
                reply.send();
                return;
            }

            reply.type('image/jpeg');
            reply.send(input);
        }
    }
]

// import * as obsService from "../../services/obs";
// import * as screenshotService from "../../services/screenshot";
// import * as twitchService from "../../services/twitch";
// import { FastifyHandler } from "@typed";

// export const obsServicePreview: FastifyHandler<void> = {
//     path: '/services/obs/preview',
//     handler: async (_, reply) => {
//         const input = await obsService.getInput()

//         if (!input) {
//             throw new Error('Cant get image')
//         }

//         reply.type('image/png');
//         reply.send(input);
//     }
// }

// export const screenshotServicePreview: FastifyHandler<void> = {
//     path: '/services/screenshot/preview',
//     handler: async (_, reply) => {
//         const input = await screenshotService.getInput()

//         if (!input) {
//             throw new Error('Cant get image')
//         }

//         reply.type('image/png');
//         reply.send(input);
//     }
// }

// export const twitchServicePreview: FastifyHandler<void> = {
//     path: '/services/twitch/preview',
//     handler: async (_, reply) => {
//         const input = await twitchService.getInput()

//         if (!input) {
//             throw new Error('Cant get image')
//         }

//         reply.type('image/png');
//         reply.send(input);
//     }
// }
// export const gg = '';
