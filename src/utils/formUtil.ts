/**
 * Convert a nested object into FormData
 * @param {Object} data - JSON data
 * @param {FormData} [formData] - Optional existing FormData object
 * @param {string} [parentKey] - For internal recursion
 * @returns {FormData}
 */
export function jsonToFormData(data, formData = new FormData(), parentKey = "") {
  if (data === null || data === undefined) return formData;

  if (typeof data !== "object" || data instanceof File || data instanceof Blob) {
    formData.append(parentKey, data);
    return formData;
  }

  if (Array.isArray(data)) {
    data.forEach((value, index) => {
      const key = `${parentKey}[${index}]`;
      jsonToFormData(value, formData, key);
    });
    return formData;
  }

  Object.entries(data).forEach(([key, value]) => {
    const formKey = parentKey ? `${parentKey}[${key}]` : key;
    jsonToFormData(value, formData, formKey);
  });

  return formData;
}
