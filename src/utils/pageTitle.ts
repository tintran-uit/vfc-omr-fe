import type { RouteLocationNormalized } from "vue-router";
import { i18n } from "@/i18n";

/** Suffix appended to every browser tab title. */
export const APP_NAME = "VFC OMR";

/**
 * Resolve the translated title for a route.
 * `route.meta.title` is an i18n key (e.g. "church.listTitle"). Route params
 * (e.g. :id) are passed through as interpolation values, so keys like
 * "Edit church #{id}" resolve using the current route's `:id` param.
 */
export function resolvePageTitle(route: RouteLocationNormalized): string {
  const titleKey = route.meta?.title as string | undefined;
  if (!titleKey) return "";

  const translated = i18n.global.t(titleKey, { ...route.params });
  // vue-i18n returns the key itself when a translation is missing.
  return translated === titleKey ? "" : translated;
}

/** Set `document.title` to "<Page Title> | VFC OMR" (or just "VFC OMR" when no title is set). */
export function applyDocumentTitle(route: RouteLocationNormalized): void {
  const title = resolvePageTitle(route);
  document.title = title ? `${title} | ${APP_NAME}` : APP_NAME;
}
