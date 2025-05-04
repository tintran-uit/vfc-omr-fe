import { computed } from 'vue';

export function getDeepValue(obj, path) {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  }
  
  export function setDeepValue(obj, path, value) {
    const parts = path.split('.');
    const last = parts.pop();
  
    const target = parts.reduce((acc, part) => {
      if (!acc[part]) acc[part] = {};
      return acc[part];
    }, obj);
  
    target[last] = value;
  }

export function useDeepModel(obj, path) {
  const keys = path.split('.');
  return computed({
    get() {
      return keys.reduce((acc, key) => acc?.[key], obj);
    },
    set(value) {
      let temp = obj;
      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          temp[key] = value;
        } else {
          if (!temp[key]) temp[key] = {};
          temp = temp[key];
        }
      });
    },
  });
}