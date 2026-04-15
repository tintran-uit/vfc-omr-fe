import { watch } from "vue";

export const normalizeCols = (cols: any) => {
  if (typeof cols === "number") {
    return { cols: 12, md: cols };
  }
  return cols;
};

export const getColProps = (field: any) => {
  // ưu tiên schema
  if (field.cols) return normalizeCols(field.cols);

  // default
  return { cols: 12, md: 6 };
};
