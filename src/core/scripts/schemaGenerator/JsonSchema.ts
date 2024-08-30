import util from 'util'
import { singleton } from 'tsyringe'
import TJS from 'typescript-json-schema'
import lodash from 'lodash'
const { isArray } = lodash

@singleton()
export default class JsonSchema {
  /**
   * Modifies schema, removing any definitions that are not actually used
   *
   * @param name [string] Name of the schema being processed. Used only to provide better error messages
   * @param schema [object]
   */
  private shrinkSchema(name: string, schema: TJS.Definition) {
    const usedDefinitions = this.schemaFindRefsRecursive(name, schema)

    if (typeof schema.definitions === 'object') {
      for (const key of Object.keys(schema.definitions)) {
        if (!usedDefinitions.has(key) && schema.definitions) {
          delete schema.definitions[key]

          if (Object.keys(schema.definitions).length === 0) {
            delete schema.definitions
          }
        }
      }
    }
  }

  private transformTargets = [
    {
      key: '$ref',
      value: '#/definitions/Prisma.JsonValue',
      replace: {
        type: ['object', 'array'],
        nullable: true,
      },
    },
  ]

  private transformResponseHandler(object: any) {
    for (const target of this.transformTargets) {
      const { key, replace, value } = target

      if (object[key] && object[key] === value) {
        object = replace
      }
    }

    return object
  }

  private transformResponseSchema(name: string, schema: any, isResponse = true) {
    let resp = schema

    if (isResponse) {
      resp = schema?.properties?.Schema?.properties?.response
      if (!resp) return schema
    }

    for (const key in resp) {
      const value = resp[key]

      if (isArray(value) && value.length && this.isObject(value[0])) {
        value.forEach((i) => this.transformResponseSchema(name, i, false))
      } else if (this.isObject(value)) {
        const newValue = this.transformResponseHandler(value)
        resp[key] = newValue
        this.transformResponseSchema(name, newValue, false)
      }
    }

    if (isResponse) {
      if (schema?.properties?.Schema?.properties?.response) {
        schema.properties.Schema.properties.response = resp
      }
    }

    return schema
  }

  /**
   * Finds all of the referred definitions that this schema uses, recursively
   *
   * @param name [string] Name of the schema being processed. Used only to provide better error messages
   * @param schema [object]
   * @returns [Set<string>]
   */
  private schemaFindRefsRecursive(name: string, schema: any) {
    const result = new Set()

    const baseRefs = this.schemaFindRefs(name, schema)

    for (const val of baseRefs.values()) {
      result.add(val)
    }

    const visited = new Set()

    const queue = new Set()

    for (const val of baseRefs.values()) {
      queue.add(val)
    }

    while (queue.size > 0) {
      const val = queue.values().next().value

      if (!visited.has(val)) {
        visited.add(val)
        const moreRefs = this.schemaFindRefs(name, schema.definitions[val])

        for (const val of moreRefs) {
          result.add(val)

          if (!visited.has(val)) {
            queue.add(val)
          }
        }
      }

      queue.delete(val)
    }

    return result
  }

  /**
   * Finds the referred definitions that this schema uses (non-recursively)
   *
   * @param name [string] Name of the schema being processed. Used only to provide better error messages
   * @param schema [object]
   * @returns [Set<string>]
   */
  private schemaFindRefs(name: string, schema: TJS.Definition) {
    const result = new Set()

    for (const key of Object.keys(schema)) {
      // Skip the "definitions" section of the JSON schema:
      if (key !== 'definitions') {
        if (key === '$ref') {
          const value = schema[key]

          if (typeof value !== 'string') {
            throw new Error(
              `Error processing schema for "${name}": Unexpected value for "$ref" key: ${JSON.stringify(value)}`,
            )
          }

          if (!value.startsWith('#/definitions/')) {
            throw new Error(
              `Error processing schema for "${name}": Value for "$ref" key
              does does not refer to a definition: ${JSON.stringify(value)}`,
            )
          }

          result.add(value.substring('#/definitions/'.length))
        } else {
          const value = schema[key as keyof typeof schema] as TJS.Definition

          if (typeof value === 'object') {
            const moreResults = this.schemaFindRefs(name, value)

            for (const val of moreResults.values()) {
              result.add(val)
            }
          }
        }
      }
    }

    return result
  }

  /**
   *
   * @param statusCodes api status codes
   * @param rawSchema ts schema
   * @returns stringified response schema object
   */
  private makeResponses(rawSchema: any, statusCodes: number[] = []) {
    return statusCodes
      .map((code) => {
        const schemaInput = code === 200 || code === 201 ? rawSchema.response.properties[`${code}`] : null

        if (schemaInput) {
          return `'${code}': ResponseSchemas[${code}](${this.stringifyObject(rawSchema.response.properties[code])})`
        } else return `'${code}': ResponseSchemas[${code}]()`
      })
      .join(',\n')
  }

  private capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1)
  private isObject = (input: any) => Object.prototype.toString.call(input) === '[object Object]'
  public stringifyObject = (object: any) =>
    util.inspect(object, { showHidden: false, compact: false, depth: null, maxArrayLength: null })

  /**
   *
   * @param generator TJS generator.
   * @param symbol A symbol that exists in generator.
   * @returns Stringified/json schema of symbol.
   */
  public getSchemaFromSymbol = async (
    symbol: string,
    schema: TJS.Definition | string,
    fileName: string,
    parentTag?: string,
  ) => {
    schema = this.transformResponseSchema(symbol, schema)

    const isPublic: string = (schema as any)['x-public']

    if (symbol.endsWith('Api')) {
      let statusCodes: number[] = (schema as any)['x-statusCode']
        ? (schema as any)['x-statusCode'].toString().split(',').map(Number)
        : [200]

      // push default status codes
      statusCodes.push(400, 429)
      if (!isPublic) statusCodes.push(401, 403)
      // make status codes unique
      statusCodes = [...new Set(statusCodes)]
      const hasDesc: string = (schema as any).description
      const hasSummary: string = (schema as any)['x-summary']
      const hasMethod: string = (schema as any)['x-method']
      const hasRoute: string = (schema as any)['x-route']
      const isDeprecated: string = (schema as any).deprecated
      const isHidden: string = (schema as any)['x-hide']
      const rawSchema = (schema as any).properties.Schema.properties

      const hasParam =
        !rawSchema.params ||
        !Object.keys(rawSchema.params).length ||
        !Object.keys(rawSchema.params.properties ?? {}).length
          ? false
          : this.stringifyObject(rawSchema.params)
      const hasBody =
        !rawSchema.body || !Object.keys(rawSchema.body).length || !Object.keys(rawSchema.body.properties ?? {}).length
          ? false
          : this.stringifyObject(rawSchema.body)
      const hasQuery =
        !rawSchema.querystring ||
        !Object.keys(rawSchema.querystring).length ||
        !Object.keys(rawSchema.querystring.properties ?? {}).length
          ? false
          : this.stringifyObject(rawSchema.querystring)

      const tag = this.capitalize(parentTag ?? fileName)
      schema = `{
        tags: ['${tag}'],
        ${hasSummary !== undefined ? "summary: '" + hasSummary + "' as const," : ''}
        ${hasMethod !== undefined ? "method: '" + hasMethod + "' as const," : ''}
        ${hasRoute !== undefined ? "route: '" + hasRoute + "' as const," : ''}
        ${hasDesc !== undefined ? "description: '" + hasDesc.split('\n').join('\\n') + "' as const," : ''}
        ${isDeprecated !== undefined ? 'deprecated: ' + isDeprecated + ' as const,' : ''}
        ${isHidden !== undefined ? 'hide: ' + isHidden + ' as const,' : ''}
        ${hasParam ? 'params: ' + hasParam + ',' : ''}
        ${hasBody ? 'body: ' + hasBody + ',' : ''}
        ${hasQuery ? 'querystring: ' + hasQuery + ',' : ''}
        response: {
          ${this.makeResponses(rawSchema, statusCodes)}
        },
      }`
    } else return

    return schema
  }
}
