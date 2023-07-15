import { FastifyReply, FastifyRequest } from "fastify";

/** Fastify Handler */
export interface FastifyHandler<T> {
    path: string,
    handler: (request: FastifyRequest, reply: FastifyReply) => Promise<T> | T | void
}