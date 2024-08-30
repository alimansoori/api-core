import { RouteHandler } from 'fastify'
import { RouteGenericInterface } from 'fastify/types/route.js'

export type IApi<T extends RouteGenericInterface> = RouteHandler<T>
