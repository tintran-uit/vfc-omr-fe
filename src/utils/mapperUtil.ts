import { getNestedValue, setNestedValue } from './objectUtil'

type MapperValue = true | string | ((value: any, data: any) => any) | Record<string, MapperValue>
interface MapFormOptions {
  schema: { name: string }[]
  mapper: Record<string, MapperValue>
  data: any
  base?: Record<string, any>
}

// ---- Layer 1: Field Mapper ----
function mapField(fieldKey: string, mapper: MapperValue, data: any): any {
  const value = getNestedValue(data, fieldKey)

  if (typeof mapper === 'function') {
    return mapper(value, data)
  }

  if (mapper === true) {
    return value
  }

  if (typeof mapper === 'string') {
    return getNestedValue(data, mapper)
  }

  if (mapper && typeof mapper === 'object') {
    const nestedData = getNestedValue(data, fieldKey) || {}
    const nestedSchema = Object.keys(mapper).map(k => ({ name: k }))
    return mapForm({ schema: nestedSchema, mapper, data: nestedData })
  }

  return undefined
}

// ---- Layer 2: Section Mapper ----
function mapSection(mapperSchema: Record<string, MapperValue>, data: any) {
  const result: any = {}
  for (const key in mapperSchema) {
    const mappedValue = mapField(key, mapperSchema[key], data)
    if (mappedValue !== undefined) {
      setNestedValue(result, key, mappedValue)
    }
  }
  return result
}

// ---- Layer 3: Form Mapper (entry point) ----
export function mapForm({ schema, mapper, data, base = {} }: MapFormOptions) {
  const result = { ...base }

  schema.forEach(field => {
    const key = field.name
    const rule = mapper[key]

    let value
    if (rule !== undefined) {
      value = mapField(key, rule, data)
    } else {
      // fallback: auto map nếu key có trong data
      value = getNestedValue(data, key)
    }

    if (value !== undefined) setNestedValue(result, key, value)
  })

  return result
}


export function mapModel(model, editData, mapper = {}) {
  if (!editData) return model

  Object.keys(model).forEach(formKey => {
    const rule = mapper[formKey] || {}

    // apiKey mặc định là formKey nếu không có rule
    const apiKey = rule.apiKey || formKey
    const raw = getNestedValue(editData, apiKey, undefined)

    if (raw !== undefined) {
      const val = rule.transform ? rule.transform(raw) : raw
      setNestedValue(model, formKey, val)
    }
  })

  return model
}