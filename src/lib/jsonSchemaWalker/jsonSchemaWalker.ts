import type { JSONSchema4, JSONSchema6, JSONSchema7 } from 'json-schema'
import { ISubSchema, IVocabulary, JSONSchema, ProcessorFunction, ProcessorFunctionInternal } from './types.js'

const visited: unique symbol = Symbol('visited')
const NEXT_SCHEMA_KEYWORD: unique symbol = Symbol('NEXT_SCHEMA_KEYWORD')
const NEXT_LDO_KEYWORD: unique symbol = Symbol('NEXT_LDO_KEYWORD')

export default class Walker<T = JSONSchema> {
  rootSchema!: T
  vocabulary!: IVocabulary
  vocabularies!: Record<string, IVocabulary>
  walker!: ProcessorFunction<T>

  constructor() {
    this.initVocabulary()
  }

  loadSchema = async (schema: T) => {
    this.rootSchema = JSON.parse(JSON.stringify(schema))
  }

  walk = async (processor: ProcessorFunction<T>, vocabulary: IVocabulary) => {
    this.vocabulary = vocabulary ?? this.vocabularies.DRAFT_07
    this.walker = processor
    this.walker(this.rootSchema)
    this.subschemaWalk(this.rootSchema as JSONSchema)
    // clean up the symbols we injected to check for circular references
    this.cleanupVisited(this.rootSchema as JSONSchema)
  }

  private cleanupVisited = (schema: ISubSchema) => {
    for (const entry of Object.values(schema)) {
      if (entry && typeof entry === 'object' && entry[visited]) {
        delete entry[visited]
        this.cleanupVisited(entry)
      }
    }
  }

  private isValidSubSchema = (schema: unknown) =>
    (schema instanceof Object && !Array.isArray(schema)) || typeof schema === 'boolean'

  private applyUserProcessor = (schema: ISubSchema, key: string | number) => {
    const schemaElement = schema[key]

    if (typeof schemaElement !== 'object') {
      return
    }

    schemaElement[visited] = true

    this.walker(schemaElement)
    this.subschemaWalk(schemaElement)
  }

  private subschemaWalk = (schema: ISubSchema) => {
    for (const keyword in schema) {
      try {
        this.processSchemaKey(schema, keyword)
      } catch (e) {
        if (e !== NEXT_SCHEMA_KEYWORD) {
          throw e
        }
      }
    }
  }

  // These are the processors
  private processSchemaKey = (schema: ISubSchema, keyword: string) => {
    if (!schema[keyword] || typeof schema[keyword] !== 'object') {
      return
    }

    const processorFunction = this.vocabulary[keyword]

    if (!processorFunction) {
      return
    }

    schema[keyword][visited] = true
    processorFunction(schema, keyword)
  }
  private processObjectOfSchemas = (schema: ISubSchema, keyword: string) => {
    for (const prop of Object.getOwnPropertyNames(schema[keyword])) {
      const schemaElem = schema[keyword][prop]

      if (typeof schemaElem === 'object' && schemaElem) {
        this.applyUserProcessor(schema[keyword], prop)
      }
    }
  }
  private processArrayOfSchemas = (schema: ISubSchema, keyword: string) => {
    for (const prop of Object.getOwnPropertyNames(schema[keyword])) {
      const schemaElem = schema[keyword][prop]

      if (schemaElem && typeof schemaElem === 'object') {
        this.applyUserProcessor(schema[keyword], prop)
      }
    }

    for (let i = 0; i < schema[keyword].length; i++) {
      this.applyUserProcessor(schema[keyword], i)
    }
  }
  private processSingleOrArrayOfSchemas = (schema: ISubSchema, keyword: string) => {
    if (this.isValidSubSchema(schema[keyword])) {
      this.processSingleSchema(schema, keyword)
    } else {
      this.processArrayOfSchemas(schema, keyword)
    }
  }

  private processSingleSchema = (schema: ISubSchema, keyword: string) => {
    this.applyUserProcessor(schema, keyword)
  }

  /**
   * Loop over the links and apply the callbacks, while
   * handling LDO keyword deletions by catching NEXT_LDO_KEYWORD.
   */
  private getProcessLinks = (ldoVocabulary: IVocabulary) => {
    return (schema: ISubSchema, keyword: string | number) => {
      for (const ldo of schema.links) {
        for (const key in ldo) {
          try {
            ldoVocabulary[keyword]?.(schema, key)
          } catch (e) {
            if (e !== NEXT_LDO_KEYWORD) {
              throw e
            }
          }
        }
      }
    }
  }

  // vocabulary initialization
  private initVocabulary = () => {
    const DRAFT_04 = {
      properties: this.processObjectOfSchemas,
      patternProperties: this.processObjectOfSchemas,
      additionalProperties: this.processSingleSchema,
      dependencies: this.processObjectOfSchemas,
      items: this.processSingleOrArrayOfSchemas,
      additionalItems: this.processSingleSchema,
      allOf: this.processArrayOfSchemas,
      anyOf: this.processArrayOfSchemas,
      oneOf: this.processArrayOfSchemas,
      not: this.processSingleSchema,
      if: this.processSingleSchema,
      then: this.processSingleSchema,
      else: this.processSingleSchema,
    } as Record<keyof JSONSchema4, ProcessorFunctionInternal>

    /**
     * LDO keywords call _apply directly as they have a different
     * mapping from the schema keyword into the path that _apply
     * expects.  This is done in the function returned from
     * _getProcessLinks();
     */
    const DRAFT_04_HYPER_LDO = {
      schema: this.applyUserProcessor,
      targetSchema: this.applyUserProcessor,
    }

    const DRAFT_04_HYPER = {
      ...DRAFT_04,
      links: this.getProcessLinks(DRAFT_04_HYPER_LDO),
    } as Record<string, ProcessorFunctionInternal>

    const DRAFT_06 = {
      ...DRAFT_04,
      propertyNames: this.processObjectOfSchemas,
    } as Record<keyof JSONSchema6, ProcessorFunctionInternal>

    const DRAFT_06_HYPER_LDO = {
      hrefSchema: this.applyUserProcessor,
      targetSchema: this.applyUserProcessor,
      submissionSchema: this.applyUserProcessor,
    }

    const DRAFT_06_HYPER = {
      ...DRAFT_06,
      links: this.getProcessLinks(DRAFT_06_HYPER_LDO),
    } as Record<keyof JSONSchema6, ProcessorFunctionInternal>

    const DRAFT_07 = { ...DRAFT_06 } as Record<keyof JSONSchema7, ProcessorFunctionInternal>

    const DRAFT_07_HYPER_LDO = {
      ...DRAFT_06_HYPER_LDO,
      headerSchema: this.applyUserProcessor,
    } as Record<string, ProcessorFunctionInternal>

    const DRAFT_07_HYPER = {
      ...DRAFT_07,
      links: this.getProcessLinks(DRAFT_07_HYPER_LDO),
    } as Record<string, ProcessorFunctionInternal>

    const CLOUDFLARE_DOCA = {
      ...DRAFT_04,
      links: this.getProcessLinks({
        ...DRAFT_04_HYPER_LDO,
        ...DRAFT_07_HYPER_LDO,
      }),
    } as Record<string, ProcessorFunctionInternal>
    this.vocabularies = {
      DRAFT_04,
      DRAFT_04_HYPER,
      DRAFT_04_HYPER_LDO,
      DRAFT_06,
      DRAFT_06_HYPER,
      DRAFT_06_HYPER_LDO,
      DRAFT_07,
      DRAFT_07_HYPER,
      DRAFT_07_HYPER_LDO,
      CLOUDFLARE_DOCA,
    } as const
  }
}
