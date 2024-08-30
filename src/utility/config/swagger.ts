import { SwaggerOptions } from '@fastify/swagger'

export default <SwaggerOptions>{
  exposeRoute: true,
  openapi: {
    info: {
      title: 'ILYA API Explorer',
      'x-logo': {
        url: 'https://alimansoori71.xyz/api/upload/mock/logotype.svg',
        altText: 'Ilya api explorer',
      },
      description: `Send HTTP requests and view examples for Ilya™ APIs without writing code or setting up an environment.
      <br><br>
      Interested in Ilya™ design system? <a href="https://design.alimansoori71.xyz/">Check Ilya™ design system guide</a>`,
      version: 'v1',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        apiKey: {
          type: 'apiKey',
          name: 'x-Content-tttt',
          in: 'header',
        },
      },
    },
    security: [{ bearerAuth: [] }, { apiKey: [] }],
    externalDocs: {
      url: 'https://alimansoori71.ir',
      description: 'Find more info here',
    },
    servers: [
      { url: 'http://localhost:3002/api/v1', description: 'Local development' },
      { url: 'https://staging.alimansoori71.us/api/v1', description: 'Staging server' },
      // { url: 'https://dev.legaler.com/api/v1', description: 'Production server' },
    ],
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    // tags: [ { name: 'test', description: 'Test api' } ],
  },
  uiConfig: {
    docExpansion: 'none',
  },
  /*   transform: (d) => {
    logger.log(d);
    return d;
  }, */
}
