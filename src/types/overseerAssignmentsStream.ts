export type OverseerProfile = {
  id: number;
  name: string;
  role_name: string;
  title: string;
  email: string;
  photo?: string;
  photo_url?: string;
};

export type OverseerAssignmentItem = {
  overseer_profile: OverseerProfile;
  overseer_permissions: Record<string, unknown>;
  overseer_indicators: Record<string, unknown>;
  pastoral_visits_graph?: Record<string, unknown>;
  church_planted_graph?: Record<string, unknown>;
};

export type OverseerAssignmentsStreamMeta = {
  total_count: number;
};

export type OverseerAssignmentsStreamEnvelope = {
  success: boolean;
  message?: string;
  data?: {
    type?: string;
    total_count?: number;
    index?: number;
    item?: OverseerAssignmentItem;
  };
};

export type OverseerAssignmentsStreamResult = {
  meta: OverseerAssignmentsStreamMeta | null;
  items: OverseerAssignmentItem[];
};

export type OverseerAssignmentsStreamHandlers = {
  onMeta?: (meta: OverseerAssignmentsStreamMeta) => void;
  onItem?: (payload: { index: number; item: OverseerAssignmentItem }) => void;
};

export function isOverseerStreamMetaLine(
  line: OverseerAssignmentsStreamEnvelope,
): line is OverseerAssignmentsStreamEnvelope & {
  data: { type: "meta"; total_count?: number };
} {
  return line.success === true && line.data?.type === "meta";
}

export function isOverseerStreamItemLine(
  line: OverseerAssignmentsStreamEnvelope,
): line is OverseerAssignmentsStreamEnvelope & {
  data: { type: "item"; index?: number; item: OverseerAssignmentItem };
} {
  return line.success === true && line.data?.type === "item" && line.data.item != null;
}

/** Routes one NDJSON envelope to meta or item handlers. */
export function dispatchOverseerAssignmentsStreamLine(
  raw: unknown,
  handlers: OverseerAssignmentsStreamHandlers,
): "meta" | "item" | "skipped" {
  const line = raw as OverseerAssignmentsStreamEnvelope;

  if (line?.success === false) {
    throw new Error(line.message ?? "Stream request failed");
  }

  if (isOverseerStreamMetaLine(line)) {
    const meta: OverseerAssignmentsStreamMeta = {
      total_count: line.data.total_count ?? 0,
    };
    handlers.onMeta?.(meta);
    return "meta";
  }

  if (isOverseerStreamItemLine(line)) {
    handlers.onItem?.({
      index: line.data.index ?? 0,
      item: line.data.item,
    });
    return "item";
  }

  return "skipped";
}
