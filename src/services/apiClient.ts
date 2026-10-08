import axios, { type InternalAxiosRequestConfig } from "axios";
import { jsonToFormData } from '@/utils/formUtil'
import { useLoadingStore } from "@/stores/loadingStore"
import { useMessageStore } from "@/stores/messageStore";
import { clearSessionAndGoLogin } from '@/utils/session'

type AxiosConfigWithLoading = InternalAxiosRequestConfig & {
  showLoading?: boolean
  rawResponse?: boolean
}

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

/**
 * Reports can take much longer than the default timeout, and the caller needs the
 * raw response so `Content-Disposition` survives the response interceptor.
 */
const postDownload = async (uri, payload, showLoading = true, timeout = 180000) => {
  return await instance.post(
    uri,
    payload,
    {
      responseType: 'blob',
      showLoading,
      rawResponse: true,
      timeout
    }
  )
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

    if ((response.config as AxiosConfigWithLoading).rawResponse) {
      return response;
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
                authStore.impersonatorToken = null;
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
        const data = error.response.data;
        const hasFieldErrors =
          data && typeof data.errors === 'object' && data.errors !== null && Object.keys(data.errors).length > 0;

        // When the API returns field-level validation errors, let the caller show them
        // inline (e.g. DynamicFormDefault.setServerErrors) instead of a generic toast.
        if (!hasFieldErrors && data?.message) {
          useMessageStore().error(data.message);
        }

        return Promise.reject(data);
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
  postDownload,
  postFormData,
  put,
  del,
  patch,
  instance
};