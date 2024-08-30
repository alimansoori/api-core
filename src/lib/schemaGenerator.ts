import { mkdirSync, promises } from 'fs'
import { join, resolve } from 'path'
import { injectable } from 'tsyringe'
import {
  buildGenerator,
  CompilerOptions,
  Definition,
  getProgramFromFiles,
  JsonSchemaGenerator,
  PartialArgs,
  Program,
} from 'typescript-json-schema'
import { format } from 'prettier'
import { convert } from './jsonSchemaToOpenApi/JsonSchemaToOpenApi.js'

export type FGeneratorHandler<T = any> = (
  symbol: string,
  fileName: string,
  schema: Definition,
  customData: T,
) => Promise<string | void>
interface ICreateProgram {
  originDir: string
  compilerOptions: CompilerOptions
}
interface ICreateGenerator {
  program: Program
  generatorSetting: PartialArgs
}
interface ISchemaGenerator {
  originDir: string
  destDir: string
  handler: FGeneratorHandler
  options: {
    parentDirName?: string
    program?: Program
    prefixOutputName: string
    outputHeaderContent: string
    excludeSymbols?: string[]
    excludeFiles?: string[]
  }
}
@injectable()
export class SchemaGenerator {
  public async schemaInitiator(data: ISchemaGenerator) {
    const { options, handler } = data
    let { destDir, originDir } = data
    const EXCLUDE_FILES = options.excludeFiles ?? ['index.ts']
    const EXCLUDE_SYMBOLS = options.excludeSymbols ?? []
    originDir = resolve(originDir)
    destDir = resolve(destDir)

    this.createBaseDir(destDir)

    // initiate the ts program.
    const compilerOptions = this.getCompilerConfig()
    const program = options?.program || this.createProgram({ compilerOptions, originDir })
    const generatorSetting = this.getGeneratorSetting()
    const generator = this.createGenerator({ program, generatorSetting })
    if (!generator) throw new Error()

    // get all the files in interface directory.
    const files = await this.getFiles(originDir, EXCLUDE_FILES)

    for (const file of files) {
      const { name: fileName } = file

      if (file.isDirectory()) {
        const startPath = join(originDir, fileName) + '/'
        await this.schemaInitiator({
          destDir,
          originDir: startPath,
          handler,
          options: { ...options, program, parentDirName: fileName },
        })
        continue
      }

      // eslint-disable-next-line no-console
      console.log(fileName)

      const symbols = this.getSymbols(program, generator, originDir, fileName, EXCLUDE_SYMBOLS)

      await this.handlerRunner({
        symbols,
        handler,
        destDir,
        fileName,
        generator,
        outputHeaderContent: options.outputHeaderContent,
        prefixOutputName: options.prefixOutputName,
        customData: { parentDirName: options?.parentDirName },
      })
    }
  }

  private async handlerRunner(data: {
    symbols: string[]
    generator: JsonSchemaGenerator
    handler: FGeneratorHandler
    destDir: string
    fileName: string
    prefixOutputName: string
    outputHeaderContent: string
    customData: any
  }) {
    const { handler, destDir, symbols, generator, prefixOutputName, outputHeaderContent, customData } = data
    const fileName = data.fileName.split('.')[0]
    let count = 0
    let content = outputHeaderContent

    for (const symbol of symbols) {
      const schema = generator.getSchemaForSymbol(symbol)

      if (!schema) continue
      const openApiSchema = await convert<Definition>(schema)

      const result = await handler(symbol, fileName, openApiSchema, customData)
      if (!result) continue
      content += result
      count++
    }

    const outputAddress = join(destDir, fileName + `.${prefixOutputName}.ts`)

    const formattedOutput = await this.formatCode(content)
    const oldFile = await promises.readFile(outputAddress, { encoding: 'utf8' })

    if (oldFile && oldFile === formattedOutput) {
      // eslint-disable-next-line no-useless-return
      return
    } else {
      promises.writeFile(outputAddress, formattedOutput)
      // eslint-disable-next-line no-console
      console.log('-> ' + count)
    }
  }

  private getCompilerConfig(): CompilerOptions {
    return { strictNullChecks: true }
  }

  private getGeneratorSetting(): PartialArgs {
    return {
      ref: false,
      required: true,
      noExtraProps: true,
      ignoreErrors: true,
      defaultNumberType: 'integer',
      validationKeywords: [
        'coerce',
        'statusCode',
        'summary',
        'deprecated',
        'hide',
        'public',
        'route',
        'method',
        'example',
      ],
    }
  }

  private createProgram({ compilerOptions, originDir }: ICreateProgram) {
    return getProgramFromFiles([resolve(originDir, 'index.ts')], compilerOptions)
  }

  private createGenerator({ generatorSetting, program }: ICreateGenerator) {
    return buildGenerator(program, generatorSetting)
  }

  private createBaseDir(path: string) {
    mkdirSync(path, { recursive: true })
  }

  private getSymbols(
    program: Program,
    generator: JsonSchemaGenerator,
    originDir: string,
    fileName: string,
    exclude: string[],
  ) {
    const symbols = generator.getMainFileSymbols(
      program,
      [resolve(originDir, fileName).replace(/\\/g, '/')], // replace \ for win OS.
    )

    const symbolsSet = new Set(symbols)
    exclude.forEach((excluded) => symbolsSet.delete(excluded))
    return Array.from(symbolsSet)
  }

  private async getFiles(originDir: string, exclude: string[]) {
    return (await promises.readdir(originDir, { withFileTypes: true })).filter(
      (file) => !exclude.find((name) => name === file.name),
    )
  }

  /**
   * @param code Stringified typescript code.
   */
  private formatCode = (code: string) => {
    return format(code, {
      parser: 'typescript',
      tabWidth: 2,
      semi: true,
      bracketSpacing: true,
      singleQuote: true,
      printWidth: 125,
      endOfLine: 'lf', // avoids unnecessary git changes when code formats in different OSs.
    })
  }
}
