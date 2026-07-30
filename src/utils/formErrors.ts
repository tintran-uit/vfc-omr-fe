export type FieldErrors = Record<string, string[]>;

function toMessageArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((v) => String(v));
  if (value == null || value === "") return [];
  return [String(value)];
}

/**
 * Normalize a validation error map shaped like:
 *   { username: "Username is a required field", password: ["Too short", "..."] }
 * into `{ field: string[] }`, ignoring anything that isn't a plain object.
 */
export function normalizeFieldErrors(errors: unknown): FieldErrors {
  if (!errors || typeof errors !== "object" || Array.isArray(errors)) return {};

  const out: FieldErrors = {};
  for (const [key, value] of Object.entries(errors as Record<string, unknown>)) {
    const messages = toMessageArray(value);
    if (messages.length) out[key] = messages;
  }
  return out;
}

/**
 * Extract `{ message, errors }` from an API error, whether it was rejected as
 * the raw response body (apiClient's interceptor already unwraps to `error.response.data`)
 * or as a full axios error object.
 */
export function extractApiError(err: unknown): { message?: string; errors: FieldErrors } {
  const data: any = (err as any)?.response?.data ?? err ?? {};
  return {
    message: typeof data?.message === "string" ? data.message : undefined,
    errors: normalizeFieldErrors(data?.errors),
  };
}

/**
 * Pull the raw `errors` object out of an API error body / axios error, or return
 * the input itself when it already looks like a field→message map.
 * Does not stringify nested objects — use with `flattenErrorKeys` for that.
 */
export function unwrapErrorMap(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== "object" || Array.isArray(input)) return {};

  const obj = input as Record<string, unknown>;
  const fromResponse = (obj as any)?.response?.data;
  const data = fromResponse && typeof fromResponse === "object" ? fromResponse : obj;

  if (
    data &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    "errors" in data &&
    data.errors &&
    typeof data.errors === "object" &&
    !Array.isArray(data.errors)
  ) {
    return data.errors as Record<string, unknown>;
  }

  // Already a field map (possibly nested under schema keys).
  return data as Record<string, unknown>;
}

/**
 * Accept either a field-error map or a full API error body / axios error and
 * return the normalized flat field-error map.
 */
export function coerceFieldErrors(input: unknown): FieldErrors {
  return normalizeFieldErrors(unwrapErrorMap(input));
}

/**
 * Flatten a one-level-nested error object (e.g. `{ user: { username: "..." } }`)
 * into dotted keys (`{ "user.username": "..." }`), for multi-schema forms
 * (DynamicFormMultiple) whose fields are addressed as `schemaKey.fieldName`.
 * Already-flat keys (strings/arrays) pass through unchanged.
 */
export function flattenErrorKeys(errors: unknown): Record<string, unknown> {
  if (!errors || typeof errors !== "object" || Array.isArray(errors)) return {};

  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(errors as Record<string, unknown>)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      for (const [nestedKey, nestedValue] of Object.entries(value as Record<string, unknown>)) {
        out[`${key}.${nestedKey}`] = nestedValue;
      }
    } else {
      out[key] = value;
    }
  }
  return out;
}

function mergeMessages(existing: string[] | undefined, next: string[]): string[] {
  return existing?.length ? [...existing, ...next] : next;
}

/**
 * Remap API error keys onto schema field names.
 * Supports exact matches and dotted keys (`user.username` → `username`).
 */
export function mapErrorsToFieldNames(errors: FieldErrors, fieldNames: string[]): FieldErrors {
  const nameSet = new Set(fieldNames);
  const out: FieldErrors = {};

  for (const [key, messages] of Object.entries(errors)) {
    if (nameSet.has(key)) {
      out[key] = mergeMessages(out[key], messages);
      continue;
    }

    const lastSegment = key.includes(".") ? key.slice(key.lastIndexOf(".") + 1) : null;
    if (lastSegment && nameSet.has(lastSegment)) {
      out[lastSegment] = mergeMessages(out[lastSegment], messages);
    }
  }

  return out;
}

/**
 * Remap API error keys onto DynamicFormMultiple `accessKey`s (`schemaKey.fieldName`).
 * Accepts accessKey, plain field name, or dotted keys; ambiguous plain names
 * attach to the first matching field in schema order.
 */
export function mapErrorsToAccessKeys(
  errors: FieldErrors,
  fields: Array<{ name: string; accessKey: string }>,
): FieldErrors {
  const byAccessKey = new Set(fields.map((f) => f.accessKey));
  const byName = new Map<string, string[]>();
  for (const f of fields) {
    const list = byName.get(f.name) || [];
    list.push(f.accessKey);
    byName.set(f.name, list);
  }

  const out: FieldErrors = {};

  for (const [key, messages] of Object.entries(errors)) {
    if (byAccessKey.has(key)) {
      out[key] = mergeMessages(out[key], messages);
      continue;
    }

    const nameCandidates = byName.get(key);
    if (nameCandidates?.length) {
      const target = nameCandidates[0];
      out[target] = mergeMessages(out[target], messages);
      continue;
    }

    const lastSegment = key.includes(".") ? key.slice(key.lastIndexOf(".") + 1) : null;
    if (lastSegment) {
      const lastCandidates = byName.get(lastSegment);
      if (lastCandidates?.length) {
        const target = lastCandidates[0];
        out[target] = mergeMessages(out[target], messages);
      }
    }
  }

  return out;
}
