// export const getNestedValue = (obj, path) => path.split('.').reduce((o, k) => o?.[k], obj);

// export const getNestedValue = (obj, path, defaultValue = null) => {
//   const result = path.split('.').reduce((o, k) => o?.[k], obj)
//   return result === undefined ? (typeof(defaultValue) === 'function' ? defaultValue() : defaultValue) : result
// }

// export const setNestedValue = (obj, path, value) => {
//   const keys = path.split('.')
//   const lastKey = keys.pop()
//   const target = keys.reduce((o, k) => {
//     if (!o[k]) o[k] = {}
//     return o[k]
//   }, obj)
//   target[lastKey] = value
// }

// export const setNestedValue = (obj, path, value, defaultValue = null) => {
//   const keys = path.split('.')
//   const lastKey = keys.pop()
//   const target = keys.reduce((o, k) => {
//     if (!o[k]) o[k] = {}
//     return o[k]
//   }, obj)
//   target[lastKey] = value ?? (typeof(defaultValue) === 'function' ? defaultValue() : defaultValue)
// }

export const getNestedValue = (obj, path, defaultValue = null) => {
  const keys = path.split(".");
  let target = obj;

  keys.forEach((key, index) => {
    const isLast = index === keys.length - 1;

    if (
      target[key] === undefined ||
      target[key] === null ||
      (typeof target[key] !== "object" && !isLast)
    ) {
      target[key] = isLast
        ? typeof defaultValue === "function"
          ? defaultValue()
          : defaultValue
        : {};
    }

    target = target[key];
  });

  return target;
};

export const setNestedValue = (obj, path, value, defaultValue = null) => {
  const keys = path.split(".");
  const lastKey = keys.pop();

  const target = keys.reduce((o, k) => {
    if (o[k] === undefined || o[k] === null) {
      o[k] = {};
    }
    return o[k];
  }, obj);

  target[lastKey] =
    value !== undefined
      ? value
      : typeof defaultValue === "function"
        ? defaultValue()
        : defaultValue;
};

// const castValue = (value: any, type?: string) => {
//   if (value == null) return null; // null hoặc undefined → empty string
//   switch (type) {
//     case 'number': return Number(value);
//     case 'string': return String(value);
//     case 'boolean': return Boolean(value);
//     case 'date': return new Date(value);
//     default: return value;
//   }
// }

// export const getNestedValue = (obj: any, path: string, defaultValue: any = '', type?: string) => {

//   const keys = path.split('.');
//   let target = obj;

//   keys.forEach((key, index) => {
//     if (target[key] == null) {
//       target[key] = (typeof defaultValue === 'function' && index === keys.length - 1)
//         ? defaultValue()
//         : defaultValue;
//     }
//     target = target[key];
//   });

//   return castValue(target, type);
// }

// export const setNestedValue = (obj: any, path: string, value: any, defaultValue: any = '', type?: string) => {
//   const keys = path.split('.');
//   const lastKey = keys.pop();
//   const target = keys.reduce((o, k) => {
//     if (o[k] == null) o[k] = {};
//     return o[k];
//   }, obj);

//   target[lastKey] = castValue(
//     value != null ? value : (typeof defaultValue === 'function' ? defaultValue() : defaultValue),
//     type
//   );
// }

// export const initializeFormData = (schema) => {
//   const result = {}
//
//   schema.forEach(field => {
//     setNestedValue(result, field.name, field.default ?? '')
//   })
//
//   return result
// }

export const cloneDeep = (value) => {
  return JSON.parse(JSON.stringify(value));
};

export const initFormData = (schema, initValue = {}) => {
  const result = {};

  schema.forEach((field) => {
    const defaultVal = field.default ?? "";
    setNestedValue(result, field.name, defaultVal);
  });

  // Gộp initValue (nếu có) → override
  const copiedInit = cloneDeep(initValue);
  Object.entries(flatObject(copiedInit)).forEach(([path, value]) => {
    setNestedValue(result, path, value);
  });

  return result;
};

/**
 * @param {Object} obj
 * @param {String} prefix
 * @returns {Object}
 */
export const flatObject = (obj, prefix = "") => {
  const res = {};
  for (const key in obj) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(res, flatObject(obj[key], path));
    } else {
      res[path] = obj[key];
    }
  }
  return res;
};

/**
 * Flatten a tree or a forest into an array using a callback.
 * @param {Object|Object[]} input  - root node or array of root nodes
 * @param {(node: Object, level: number) => any} callback
 * @returns {any[]} flattened result
 */
export const flatten = (input, callback) => {
  const result = [];

  function walk(node, level) {
    result.push(callback(node, level));
    if (Array.isArray(node.children) && node.children.length) {
      for (const child of node.children) {
        walk(child, level + 1);
      }
    }
  }

  if (Array.isArray(input)) {
    for (const node of input) walk(node, 0);
  } else if (input && typeof input === "object") {
    walk(input, 0);
  }

  return result;
};
