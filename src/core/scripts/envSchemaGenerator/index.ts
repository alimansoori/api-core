import 'reflect-metadata'
import util from 'util'
import { container, inject, injectable } from 'tsyringe'
import { FGeneratorHandler, SchemaGenerator } from '@app/lib/schemaGenerator.js'

@injectable()
export class ApiSchemaGenerator {
  constructor(@inject(SchemaGenerator) public generatorEngine: SchemaGenerator) {
    generatorEngine.schemaInitiator({
      originDir: 'src/interfaces/environment/',
      destDir: 'src/utility/schema/',
      options: {
        excludeSymbols: [],
        excludeFiles: ['config.ts', 'index.ts'],
        prefixOutputName: 'schema',
        outputHeaderContent: '',
      },
      handler: this.handler,
    })
  }

  handler: FGeneratorHandler = async (symbol, fileName, schema) => {
    if (schema) {
      return `export const ${symbol}Schema = ${
        typeof schema === 'string'
          ? schema
          : util.inspect(schema, { showHidden: false, compact: false, depth: null, maxArrayLength: null })
      };\n\n`
    }
  }
}

;(() => {
  container.resolve(ApiSchemaGenerator)
})()
