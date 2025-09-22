export function tableOptionsToParams(options) {
  const params = {};

  if (options?.page) {
    params.page = options.page;
  }
  if (options?.itemsPerPage) {
    params.limit = options.itemsPerPage;
  }

  // Sorting
  if (options?.sortBy && options.sortBy.length > 0) {
    params.sort_by = options.sortBy[0]['key'];
    params.sort_desc = options.sortBy[0]['order'] === 'desc' ? 'true' : 'false';
  }

//   if (options.filters) {
//     Object.keys(options.filters).forEach(key => {
//       if (options.filters[key] !== null && options.filters[key] !== undefined && options.filters[key] !== '') {
//         params[`filter[${key}]`] = options.filters[key];
//       }
//     });
//   }


  if (options?.searches) {
    options.searches.forEach(item => {
        params[item.key] = item.value;
    });
  }

  return params;
}