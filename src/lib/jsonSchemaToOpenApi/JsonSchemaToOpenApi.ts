import type { JSONSchema4, JSONSchema6Definition, JSONSchema7Definition } from 'json-schema'
import { JSONSchema, SchemaType, SchemaTypeKeys } from './types.js'
import { allowedKeywords, oasExtensionPrefix } from './constants.js'
import Walker from '../jsonSchemaWalker/jsonSchemaWalker.js'

class InvalidTypeError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidTypeError'
    this.message = message
  }
}

const handleDefinition = async <T extends JSONSchema>(
  def: JSONSchema7Definition | JSONSchema6Definition | JSONSchema4,
  schema: T,
) => {
  if (typeof def !== 'object') {
    return def
  }

  const type = def.type

  if (type) {
    // Walk just the definitions types
    const walker = new Walker<T>()
    await walker.loadSchema({
      definitions: schema['definitions'] || [],
      ...def,
      $schema: schema['$schema'],
    } as any)
    await walker.walk(convertSchema, walker.vocabularies.DRAFT_07)

    if ('definitions' in walker.rootSchema) {
      delete (<any>walker.rootSchema).definitions
    }

    return walker.rootSchema
  } else if (Array.isArray(def)) {
    // if it's an array, we might want to reconstruct the type;
    const typeArr = def
    const hasNull = typeArr.includes('null')

    if (hasNull) {
      const actualTypes = typeArr.filter((l) => l !== 'null')
      return {
        type: actualTypes.length === 1 ? actualTypes[0] : actualTypes,
        nullable: true,
        // this is incorrect but thats ok, we are in the inbetween phase here
      } as JSONSchema7Definition | JSONSchema6Definition | JSONSchema4
    }
  }

  return def
}

export const convert = async <T = JSONSchema>(schema: T): Promise<T> => {
  const walker = new Walker<T>()
  await walker.loadSchema(schema)
  await walker.walk(convertSchema as any, walker.vocabularies.DRAFT_07)

  const rootSchema = walker.rootSchema as unknown as JSONSchema

  // iteratively convert unreferenced definitions
  if (rootSchema?.definitions) {
    for (const defName in rootSchema.definitions) {
      const def = rootSchema.definitions[defName]
      rootSchema.definitions[defName] = await handleDefinition(def, schema as JSONSchema)
    }
  }

  return rootSchema as T
}

function stripIllegalKeywords(schema: SchemaType) {
  if (typeof schema === 'object') {
    delete schema['$schema']
    delete schema['$id']

    if ('id' in schema) {
      delete schema['id']
    }
  }
}

function convertSchema(schema: SchemaType | undefined) {
  if (!schema) {
    return schema
  }

  stripIllegalKeywords(schema)
  schema = convertTypes(schema)
  schema = rewriteConst(schema)
  schema = convertDependencies(schema)
  schema = rewriteIfThenElse(schema)
  schema = convertExamples(schema)

  if (typeof schema['patternProperties'] === 'object') {
    schema = convertPatternProperties(schema)
  }

  if (schema.type === 'array' && typeof schema.items === 'undefined') {
    schema.items = {}
  }

  // should be called last
  schema = convertIllegalKeywordsAsExtensions(schema)
  return schema
}

const validTypes = new Set(['null', 'boolean', 'object', 'array', 'number', 'string', 'integer'])

function validateType(type: any) {
  if (typeof type === 'object' && !Array.isArray(type)) {
    // Refs are allowed because they fix circular references
    if (type.$ref) {
      return
    }

    // this is a de-referenced circular ref
    if (type.properties) {
      return
    }
  }

  const types = Array.isArray(type) ? type : [type]
  types.forEach((type) => {
    if (type && !validTypes.has(type)) {
      throw new InvalidTypeError('Type "' + type + '" is not a valid type')
    }
  })
}

function convertDependencies(schema: SchemaType) {
  const deps = schema.dependencies

  if (typeof deps !== 'object') {
    return schema
  }

  // Turns the dependencies keyword into an allOf of oneOf's

  delete schema['dependencies']

  if (!Array.isArray(schema.allOf)) {
    schema.allOf = []
  }

  for (const key in deps) {
    const foo: (JSONSchema4 & JSONSchema6Definition) & JSONSchema7Definition = {
      oneOf: [
        {
          not: {
            required: [key],
          },
        },
        {
          required: [key, deps[key]].flat() as string[],
        },
      ],
    }
    schema.allOf.push(foo)
  }

  return schema
}

function convertTypes(schema: SchemaType) {
  if (typeof schema !== 'object') {
    return schema
  }

  if (schema.type === undefined) {
    return schema
  }

  validateType(schema.type)

  if (Array.isArray(schema.type)) {
    if (schema.type.includes('null')) {
      schema.nullable = true
    }

    const nonNullTypes = schema.type.filter((type) => type !== 'null')

    if (nonNullTypes.length === 0) {
      schema.type = 'object'
    } else if (nonNullTypes.length === 1) {
      schema.type = nonNullTypes[0]
    } else {
      delete schema.type
      schema.anyOf = nonNullTypes.map((type) => ({ type }))

      if (schema.nullable) {
        delete schema.nullable
        ;(schema.anyOf[0] as SchemaType).nullable = true
      }
    }
  } else if (schema.type === 'null') {
    schema.type = 'object'
    schema.nullable = true
  }

  return schema
}

// "patternProperties did not make it into OpenAPI v3.0"
// https://github.com/OAI/OpenAPI-Specification/issues/687
function convertPatternProperties(schema: SchemaType) {
  schema['x-patternProperties'] = schema['patternProperties']
  delete schema['patternProperties']
  schema.additionalProperties ??= true
  return schema
}

// keywords (or property names) that are not recognized within OAS3 are rewritten into extensions.
function convertIllegalKeywordsAsExtensions(schema: SchemaType) {
  const keys = Object.keys(schema) as SchemaTypeKeys[]
  keys
    .filter((keyword) => !keyword.startsWith(oasExtensionPrefix) && !allowedKeywords.includes(keyword))
    .forEach((keyword: SchemaTypeKeys) => {
      const key = `${oasExtensionPrefix}${keyword}` as keyof SchemaType
      schema[key] = schema[keyword]
      delete schema[keyword]
    })
  return schema
}

function convertExamples(schema: SchemaType) {
  if (schema['examples'] && Array.isArray(schema['examples'])) {
    schema['example'] = schema['examples'][0]
    delete schema['examples']
  }

  return schema
}

function formatDescription(schema: SchemaType) {
  if (schema.description) {
    // for windows environment, we must convert \r\n with \n to be consistent with unix
    schema.description = schema.description.replace(/\r\n+/g, '\n')
  }

  return schema
}

function rewriteConst(schema: SchemaType) {
  if (Object.hasOwnProperty.call(schema, 'const')) {
    schema.enum = [schema.const]
    delete schema.const
  }

  return schema
}

function rewriteIfThenElse(schema: SchemaType) {
  if (typeof schema !== 'object') {
    return schema
  }

  /* @handrews https://github.com/OAI/OpenAPI-Specification/pull/1766#issuecomment-442652805
  if and the *Of keywords
  There is a really easy solution for implementations, which is that
  if: X, then: Y, else: Z
  is equivalent to
  oneOf: [allOf: [X, Y], allOf: [not: X, Z]]
  */
  if ('if' in schema && schema.if && schema.then) {
    schema.oneOf = [
      { allOf: [schema.if, schema.then].filter(Boolean) },
      { allOf: [{ not: schema.if }, schema.else].filter(Boolean) },
    ]
    delete schema.if
    delete schema.then
    delete schema.else
  }

  return schema
}
