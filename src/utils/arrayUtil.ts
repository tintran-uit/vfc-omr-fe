export const filterRecursive = function (arr, fn) {
  return arr.reduce(
    (acc, item) => {
      // Clone item
      const newItem = {...item};

      // Skip result
      if (!fn(newItem)) {
        return acc;
      }

      if (Array.isArray(newItem?.children)) {
        const newChildren = filterRecursive(
          [...newItem.children],
          fn
        );

        if (newChildren.length === 0) {
          return acc;
        }

        newItem.children = newChildren;
      }

      acc.push(newItem);

      return acc;
    },
    []
  );
}

export const range = function(start, end) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}
