import { PrismaModelsName } from '@app/interfaces/PrismaModelsName.js'
import { FastifyInstance } from 'fastify'
import TestHelper from '../testHelpers.js'

export type TestContext = Mocha.Context & {
  helper: TestHelper
  app: FastifyInstance
  subdomain: string
  shouldDeleteAfterTest: {
    [K in PrismaModelsName]?: {
      ids: number[]
      method: 'db' | 'repo'
      repoMethodName?: string
    }
  }
}
