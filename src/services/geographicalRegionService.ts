import apiClient from '@/services/apiClient';

function flattenTree(items) {
    const result = [];
  
    function dfs(node, path) {
      const currentPath = [...path, node.name];
  
      // destructuring để bỏ children
      const { children, left, right, ...cleanNode } = node;
  
      result.push({
        ...cleanNode,
        namePath: currentPath
      });
  
      if (Array.isArray(children)) {
        for (const child of children) {
          dfs(child, currentPath);
        }
      }
    }
  
    for (const item of items) {
      dfs(item, []);
    }
  
    return result;
  }

export const geographicalRegionService = {
    async getAll() {
        return await apiClient.get(`/geographical-regions`);
    },
    async getListAncestor(regionId) {
        return await apiClient.get(`/geographical-regions/${regionId}/ancestors`);
    },
    async getAllFlattened() {
        const data =  await apiClient.get(`/geographical-regions`);
        return flattenTree(data.items);
    },
    async getById(id) {
        return await apiClient.get(`/geographical-regions/${id}`)
    },
    async create(data) {
        return await apiClient.post(`/geographical-regions`, data)
    },
    async update(id, data) {
        return await apiClient.patch(`/geographical-regions/${id}`, data)
    },
    async del(id) {
        return await apiClient.del(`/geographical-regions/${id}`)
    }
}