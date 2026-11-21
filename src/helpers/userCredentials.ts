export const NO_MINISTERIAL_CREDENTIAL = "No";

export function holdsMinisterialCredential(value: unknown) {
  if (value == null) return false;
  const text = String(value).trim();
  return text !== "" && text !== NO_MINISTERIAL_CREDENTIAL;
}

export function withNoCredentialOption<T extends { credentials?: unknown }>(options: T | null | undefined): T {
  const source = (options ?? {}) as T;
  const list = Array.isArray(source.credentials) ? source.credentials : [];
  const rest = list.filter((item) => item !== NO_MINISTERIAL_CREDENTIAL);
  return {
    ...source,
    credentials: [NO_MINISTERIAL_CREDENTIAL, ...rest],
  };
}

export function normalizeCredentialPayload<T extends Record<string, any>>(formData: T): T {
  if (!holdsMinisterialCredential(formData.credentials)) {
    formData.credentials = null;
    formData.credentials_number = null;
    formData.credentials_from = null;
    formData.credentials_expiry_date = null;
  }
  return formData;
}
