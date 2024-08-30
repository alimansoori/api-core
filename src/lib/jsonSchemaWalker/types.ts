import type { JSONSchema4, JSONSchema6, JSONSchema7 } from 'json-schema'

export type JSONSchema = JSONSchema4 | JSONSchema6 | JSONSchema7

export type IVocabulary = Record<string, any>
export type ISubSchema = Record<string, any>

export type ProcessorFunction<T> = (schema: T) => void
export type ProcessorFunctionInternal = (schema: ISubSchema, keyword: string | number) => void
