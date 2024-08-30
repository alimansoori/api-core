import { FastifyPluginCallback } from "fastify";
import { container } from 'tsyringe';
import { IRootApi, IRootApiSchema } from "./schemas/root.schema";
import RootService from "./services/root.service";

export const rootController: FastifyPluginCallback = (fastify, opts, done) => {
    const service = container.resolve(RootService)

    fastify.get<IRootApi['fastify']>(
        '/',
        {
            schema: IRootApiSchema,
        },
        service.getRootData,
    )

    done();
}