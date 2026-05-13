import axios, { type InternalAxiosRequestConfig } from "axios";
import { jsonToFormData } from '@/utils/formUtil'
import { useLoadingStore } from "@/stores/loadingStore"
import { useMessageStore } from "@/stores/messageStore";
import { clearSessionAndGoLogin } from '@/utils/session'

type AxiosConfigWithLoading = InternalAxiosRequestConfig & { showLoading?: boolean }

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

const get = async (uri, params = {}, showLoading = true) => {
  // try {
    const { data: respData} = await instance.get(
      uri,
      {
        params,
        showLoading
      }
    );

    return respData;
  // } catch (e) {
  //   console.log('api err', e);
  // }
}

const post = async (uri, payload, showLoading = true) => {
  // try {
    const {data: respData} = await instance.post(
      uri,
      payload,
      {
        showLoading
      }
    )
    
    return respData;
  // } catch (e) {
  //   console.log('api err', e);
  // }
}

const del = async (uri, params, showLoading = true) => {
  // try {
    const { data: respData} = await instance.delete(
      uri,
      {
        params,
        showLoading
      }
    );

    return respData;
  // } catch (e) {
  //   console.log('api err', e);
  // }
}

const postFormData = async(uri, payload, showLoading = true) => {
  let formData;
  if (payload instanceof FormData) {
    formData = payload;
  } else if (typeof payload === 'object' && payload !== null) {
    formData = jsonToFormData(payload);
  } else {
    throw new Error('Payload must be an object or FormData');
  }

  const { data: respData} = await instance.post(
    uri,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      showLoading
    }
  )

  return respData;
}

const put = async (uri, data, showLoading = true) => {
  // try {
    const { data: respData} = await instance.put(
      uri,
      data,
      { showLoading }
    );

    return respData;
  // } catch (e) {
  //   console.log('api err', e);
  // }
}

const patch = async (uri, data, showLoading = true) => {
  // try {
    const { data: respData} = await instance.patch(
      uri,
      data,
      { showLoading }
    );

    return respData;
  // } catch (e) {
  //   console.log('api err', e);
  // }
}

instance.interceptors.request.use(
  (config) => {
    if ((config as AxiosConfigWithLoading).showLoading) {
      const loading = useLoadingStore();
      loading.show();
    }

      const token = localStorage.getItem("token");
      if (token) {
          config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => {
    if ((response.config as AxiosConfigWithLoading).showLoading) {
      const loading = useLoadingStore();
      loading.hide();
    }

    return response.data;
  },
  (error) => {
    if ((error.config as AxiosConfigWithLoading | undefined)?.showLoading) {
      const loading = useLoadingStore();
      loading.hide();
    }

      if (error.response && error.response.status === 401) {
          // Keep Pinia in sync with localStorage without static import cycles
          // (apiClient is imported by authService which is imported by authStore).
          import('@/stores/authStore')
            .then(({ useAuthStore }) => {
              try {
                const authStore = useAuthStore();
                authStore.user = null;
                authStore.token = null;
                authStore.permissions = [];
                authStore.returnUrl = null;
              } catch {
                // ignore if pinia isn't ready for some reason
              }
            })
            .finally(() => {
              clearSessionAndGoLogin();
            });

          return Promise.reject(error.response.data);
      } else if (error.response) {
        const msg = error.response.data?.message;
        if (msg) {
          useMessageStore().error(msg);
        }
        console.log('error.response', error);
      } else if (error.request) {
          return Promise.reject({ message: 'Can not connect to server.' });
      } else {
          return Promise.reject({ message: error.message });
      }
  }
);

export default {
  get,
  post,
  postFormData,
  put,
  del,
  patch,
  instance
};