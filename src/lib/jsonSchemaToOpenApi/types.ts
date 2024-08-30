import type { JSONSchema4, JSONSchema6, JSONSchema7 } from 'json-schema'

export type JSONSchema = JSONSchema4 | JSONSchema6 | JSONSchema7

export type addPrefixToObject = {
  [K in keyof JSONSchema as `x-${K}`]: JSONSchema[K]
}
type ExtendedJSONSchema = addPrefixToObject & JSONSchema
export type SchemaType = ExtendedJSONSchema & {
  example?: JSONSchema['examples'][number]
  'x-patternProperties'?: JSONSchema['patternProperties']
  nullable?: boolean
}
export type SchemaTypeKeys = keyof SchemaType
