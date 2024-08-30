import 'reflect-metadata'
import { container, inject, injectable } from 'tsyringe'
import { FGeneratorHandler, SchemaGenerator } from '@app/lib/schemaGenerator.js'
import JsonSchema from './JsonSchema.js'

interface IApiSchemaHandlerCustomData {
  parentDirName?: string
}

@injectable()
export class ApiSchemaGenerator {
  constructor(
    @inject(SchemaGenerator) public generatorEngine: SchemaGenerator,
    @inject(JsonSchema) public jsonSchema: JsonSchema,
  ) {
    generatorEngine.schemaInitiator({
      originDir: 'src/shared-models/api/uniclient/',
      destDir: 'src/**/*.schema.ts',
      options: {
        excludeSymbols: ['ISearchInModulesResItem', 'IUniclientOAuthAuthorizeResDataConditions'],
        prefixOutputName: 'schema',
        outputHeaderContent: "import { ResponseSchemas } from '../defaults.schema.js'\n\n",
      },
      handler: this.handler,
    })
  }

  handler: FGeneratorHandler<IApiSchemaHandlerCustomData> = async (symbol, fileName, schema, data) => {
    const proceedSchema = await this.jsonSchema.getSchemaFromSymbol(symbol, schema, fileName, data.parentDirName)

    if (proceedSchema) {
      return `export const ${symbol}Schema = ${
        typeof proceedSchema === 'string' ? proceedSchema : this.jsonSchema.stringifyObject(proceedSchema)
      };\n\n`
    }
  }
}

;(() => {
  container.resolve(ApiSchemaGenerator)
})()
