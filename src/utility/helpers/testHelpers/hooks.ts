import 'reflect-metadata'
import { runtimeEnvs } from './../../../core/runtimeEnvs.js'
runtimeEnvs()
import { container } from 'tsyringe'
import TestHelper from './testHelpers.js'

export const mochaHooks = (): Mocha.RootHookObject => {
  return {
    async beforeAll(this: Mocha.Context) {
      const helper = container.resolve(TestHelper)
      const setup = await helper.beforeAllSetup()

      const context = {
        app: setup.app,
        helper: helper,
        subdomain: setup.subdomain,
        workspace_id: setup.workspace_id,
      }

      Object.assign(this, context)
    },

    async afterAll(this: Mocha.Context) {
      const helper = container.resolve(TestHelper)
      await helper.afterAllSetup(this.app)
    },
  }
}
