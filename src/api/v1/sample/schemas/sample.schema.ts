import { extendApi, generateSchema } from '@anatine/zod-openapi';
import { IFormResponse, RequestHandler } from '@app/shared-models';
import { ResponseSchemas } from '@app/shared-models/api/json-schema/defaults.schema.js';
import { z } from 'zod';

export const SampleResSchema = extendApi(z.object({
    total: z.number().describe('Total count'),
}), {
    description: 'Ads get all categories response schema',
    example: {
        total: 100
    },
});

export const IRootApiSchema = {
    tags: ['Root'],
    summary: 'List Root data' as const,
    method: 'GET' as const,
    route: '/' as const,

    response: {
        '200': ResponseSchemas[200](generateSchema(SampleResSchema)),
        '400': ResponseSchemas[400](),
        '429': ResponseSchemas[429](),
    },
}

export type IRootRes = z.infer<typeof SampleResSchema>

export type IRootApi = RequestHandler<any, IFormResponse<IRootRes>>