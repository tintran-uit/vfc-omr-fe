import apiClient from '@/services/apiClient';

export const imageService  = {
  async uploadImage(jsonData) {
    return await apiClient.postFormData(`/images/upload`, jsonData);
  }
}