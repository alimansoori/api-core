/* eslint-disable new-cap */
import * as Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { singleton } from 'tsyringe'

@singleton()
export class AjvValidation {
  private ajv: Ajv.default
  constructor() {
    this.ajv = new Ajv.default({
      allowUnionTypes: true,
      allErrors: true,
      removeAdditional: true,
      messages: false,
      strictTuples: false,
      useDefaults: true,
      coerceTypes: 'array',
    })
    addFormats.default(this.ajv)
  }

  getAjvInstance() {
    return this.ajv
  }
}
