import { FastifyPluginCallback } from "fastify";
import { container } from 'tsyringe';
import { IRootApi, IRootApiSchema } from "./schemas/sample.schema";
import SampleService from "./services/sample.service";

export const rootController: FastifyPluginCallback = (fastify, opts, done) => {
    const service = container.resolve(SampleService)

    fastify.get<IRootApi['fastify']>(
        '/',
        {
            schema: IRootApiSchema,
        },
        service.getRootData,
    )

    done();
}