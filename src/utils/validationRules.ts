export const required = (fieldName = 'Trường này') => {
  return v => !!v || `${fieldName} là bắt buộc`;
};

export const email = v => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return !v || pattern.test(v) || 'Email không hợp lệ';
};

export const minLength = (length) => {
  return v => !v || v.length >= length || `Phải có ít nhất ${length} ký tự`;
};

export const maxLength = (length) => {
  return v => !v || v.length <= length || `Không được vượt quá ${length} ký tự`;
};

export const mustBeNumber = v => {
  return !v || !isNaN(Number(v)) || 'Phải là số';
};

export const url = v => {
  const pattern = /^(https?:\/\/)?([^\s.]+\.[^\s]{2,}|localhost)(\/\S*)?$/;
  return !v || pattern.test(v) || 'URL không hợp lệ';
};