export function createFormRules(t) {
  const baseRules = {
    /** Allows numeric 0; rejects null, undefined, blank string */
    required: (label) => (v) =>
      (v !== null && v !== undefined && String(v).trim() !== "") ||
      t("validation.required", { field: label }),
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

  const getLabel = (field: any) => {
    const key = field.labelKey || field.label;
  
    if (typeof key !== 'string' || !key) {
      return 'Field'; // fallback
    }
  
    try {
      return t(key);
    } catch (e) {
      console.warn('i18n error with key:', key);
      return key; // fallback nếu key không tồn tại
    }
  };

  function resolveRules(field, formData = {}) {
    const label = getLabel(field);
    if (!field.rules) return [];
  
    return field.rules
      .map(rule => {
        let fn = null;
  
        // --- STRING RULE
        if (typeof rule === 'string') {
          const [ruleName, param] = rule.split(':');
  
          if (ruleName === 'repeatPassword') {
            fn = baseRules.repeatPassword?.(label, param, formData);
          } else {
            fn = baseRules[ruleName]?.(label, param, formData);
          }
        }
  
        // --- OBJECT RULE
        else if (typeof rule === 'object' && rule !== null) {
          if (rule.name === 'repeatPassword') {
            fn = baseRules.repeatPassword?.(
              label,
              rule.fieldToMatch,
              formData
            );
          } else {
            fn = baseRules[rule.name]?.(
              label,
              rule.value,
              formData
            );
          }
        }
  
        // 👉 fallback nếu rule không hợp lệ
        if (typeof fn !== 'function') {
          return null;
        }
  
        return fn;
      })
      .filter(Boolean); // 🔥 cực kỳ quan trọng
  }

  return {
    resolveRules
  };
}