import { FuncKeywordDefinition } from 'ajv'

export const ajvCoerceKeyword: FuncKeywordDefinition = {
  keyword: 'x-coerce',
  type: 'string',
  modifying: true,
  metaSchema: {
    type: 'string',
    enum: ['comma'],
  },
  validate: (coerceType, data, parentSchema, path) => {
    if (coerceType === 'comma' && !Array.isArray(data) && path) path.parentData[path.parentDataProperty] = data.split(',')
    return true
  },
}

/**
 * coerceType:  comma
 * parent: schema
 * data: input data
 * it: all
 * ctx .expand
 */

/* compile: (coerceType, parent, it) => (data, ctx) => {
  console.log('coerceType', coerceType);
  console.log('parent', parent);
  console.log('data', data);
  console.log('data', ctx);

  return true;
},
 */
