import { geographicalRegionService } from "@/services/geographicalRegionService";

/**
 * Field on church detail when the API embeds the full geographic region path.
 * When available, `resolveChurchGeographicRegionDisplay` uses this and skips the ancestor fetch.
 */
export const CHURCH_DETAIL_GEOGRAPHIC_REGION_TREE_KEY = "geographical_region_tree";

function unwrapAncestorList(response: unknown): Record<string, unknown>[] {
  if (Array.isArray(response)) return response;
  if (response && typeof response === "object" && "data" in response) {
    const data = (response as { data: unknown }).data;
    return Array.isArray(data) ? data : [];
  }
  return [];
}

export function formatGeographicRegionPath(node: Record<string, unknown>): string {
  const path = [node.name];
  let current = node;

  while (
    current.children &&
    Array.isArray(current.children) &&
    current.children.length > 0
  ) {
    current = current.children[0] as Record<string, unknown>;
    path.push(current.name);
  }

  return path.filter(Boolean).join("_ ");
}

export function getGeographicRegionTreeFromChurchDetail(
  churchDetail?: Record<string, unknown> | null,
): string | null {
  if (!churchDetail) return null;

  const tree = churchDetail[CHURCH_DETAIL_GEOGRAPHIC_REGION_TREE_KEY];
  if (typeof tree === "string" && tree.trim()) return tree;

  return null;
}

/**
 * Resolves the geographic region label for a church detail view.
 * Prefers embedded tree on church detail; otherwise fetches ancestors; falls back to region name.
 */
export async function resolveChurchGeographicRegionDisplay(
  churchDetail?: Record<string, unknown> | null,
  showLoading = false,
): Promise<string> {
  const embedded = getGeographicRegionTreeFromChurchDetail(churchDetail);
  if (embedded) return embedded;

  const regionId = churchDetail?.geographical_region_id;
  if (regionId) {
    const response = await geographicalRegionService.getListAncestor(regionId, showLoading);
    const ancestors = unwrapAncestorList(response);

    if (ancestors[0]) {
      return formatGeographicRegionPath(ancestors[0]);
    }
  }

  const regionName = churchDetail?.geographical_region_name;
  return typeof regionName === "string" ? regionName : "";
}
