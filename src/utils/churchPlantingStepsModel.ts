import { range } from '@/utils/arrayUtil';

export const CPP_STEP_COUNT = 6;
export const CPP_ROW_COUNT = 9;
export const stepIndices = range(1, CPP_STEP_COUNT);
export const rowIndices = range(1, CPP_ROW_COUNT);

export const stepField = (step: number, name: string) => `step${step}_${name}`;

export const stepRowField = (step: number, row: number, suffix: 'value' | 'completed') =>
  `step${step}_row${row}_${suffix}`;

export const rowTitleField = (row: number) => `row${row}_title`;

/** Tạo object phẳng mặc định, merge với GET /steps. */
export function buildDefaultChurchPlantingStepsState(): Record<string, any> {
  const o: Record<string, any> = {
    date_proposed: null,
    date_completed: null,
  };
  for (let r = 1; r <= CPP_ROW_COUNT; r += 1) {
    o[rowTitleField(r)] = '';
  }
  for (let s = 1; s <= CPP_STEP_COUNT; s += 1) {
    o[stepField(s, 'date_proposed')] = null;
    o[stepField(s, 'date_proposed_original')] = null;
    o[stepField(s, 'date_completed')] = null;
    for (let r = 1; r <= CPP_ROW_COUNT; r += 1) {
      o[stepRowField(s, r, 'value')] = null;
      o[stepRowField(s, r, 'completed')] = null;
    }
  }
  for (let s = 7; s <= 9; s += 1) {
    for (let r = 1; r <= CPP_ROW_COUNT; r += 1) {
      o[stepRowField(s, r, 'completed')] = null;
    }
  }
  return o;
}

export function mergeStepsFromApi(raw: Record<string, any> | null | undefined) {
  const base = buildDefaultChurchPlantingStepsState();
  if (!raw || typeof raw !== 'object') {
    return base;
  }
  const merged: Record<string, any> = { ...base, ...raw };
  for (const k of Object.keys(raw)) {
    if (!(k in merged)) merged[k] = (raw as any)[k];
  }
  for (const k of Object.keys(merged)) {
    if (k.endsWith('_value') && merged[k] === null) merged[k] = '';
  }
  for (const r of range(1, CPP_ROW_COUNT)) {
    const rk = rowTitleField(r);
    if (merged[rk] == null) merged[rk] = '';
  }
  return merged;
}

export function buildStepsPatchBody(
  state: Record<string, any>
): Record<string, any> {
  return JSON.parse(
    JSON.stringify(state, (_k, v) => (v === undefined ? null : v))
  ) as Record<string, any>;
}
