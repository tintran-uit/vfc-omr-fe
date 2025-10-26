export function createFormRules(t) {
  const baseRules = {
    required: (label) => v => !!v || t('validation.required', { field: label }),
    email: (label) => v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || t('validation.email'),
    min: (label, length) => v => !v || v.length >= Number(length) || t('validation.minLength', { field: label, length }),
    max: (label, length) => v => !v || v.length <= Number(length) || t('validation.maxLength', { field: label, length }),
    url: (label) => v => {
      const pattern = /^(https?:\/\/)?([^\s.]+\.[^\s]{2,}|localhost)(\/\S*)?$/;
      return !v || pattern.test(v) || t('validation.url');
    },
    repeatPassword: (label, fieldToMatch, formData) => v => {
      return v === formData[fieldToMatch] || t('validation.repeatPassword', { field: label });
    }
  };

  function resolveRules(field, formData = {}) {
    const label = t(field.labelKey || field.label);
    if (!field.rules) return [];

    return field.rules.map(rule => {
      // --- 1. Nếu là string, parse cú pháp name:value
      if (typeof rule === 'string') {
        const [ruleName, param] = rule.split(':');
        if (ruleName === 'repeatPassword') {
          return baseRules.repeatPassword(label, param, formData);
        }
        if (param !== undefined) {
          return baseRules[ruleName]?.(label, param, formData);
        }
        return baseRules[ruleName]?.(label, undefined, formData);
      }

      // --- 2. Nếu là object rule
      if (typeof rule === 'object') {
        if (rule.name === 'repeatPassword') {
          return baseRules.repeatPassword(label, rule.fieldToMatch, formData);
        }
        return baseRules[rule.name]?.(label, rule.value, formData);
      }

      return () => true;
    });
  }

  return {
    resolveRules
  };
}