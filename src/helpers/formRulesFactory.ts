export function createFormRules(t) {
  const baseRules = {
    required: (label) => v => !!v || t('validation.required', { field: label }),
    email: (label) => v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || t('validation.email'),
    minLength: (label, length) => v => !v || v.length >= length || t('validation.minLength', { field: label, length }),
  };

  function resolveRules(field) {
    const label = t(field.labelKey || field.label);
    if (!field.rules) return [];
    
    return field.rules.map(rule => {
      if (typeof rule === 'string') {
        return baseRules[rule]?.(label);
      } else if (typeof rule === 'object') {
        return baseRules[rule.name]?.(label, rule.value);
      }
      return () => true;
    });
  }

  return {
    resolveRules
  };
}
