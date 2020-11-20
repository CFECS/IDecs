import { Plugin } from '@nuxt/types';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import * as dayjs from 'dayjs';
import { message } from 'ant-design-vue';
import { injectAxiosToStore } from '../store/axios';
import { SYSTEM_ERROR, STATUS_ERROR, RESPONSE_ERROR } from '../types/constants';

declare module 'vue/types/vue' {
  interface Vue {
    $axios: any;
  }
}

const Axios: Plugin = ({ env, app }, inject) => {
  const instance: AxiosInstance = axios.create({
    baseURL: '/api',
    withCredentials: true,
  });

  instance.interceptors.request.use(
    async (config: AxiosRequestConfig) => {
      const timestamp: number = dayjs().valueOf() * 1000;
      const password: string = timestamp + ':' + config.baseURL + config.url;
      config.headers.common.timestamp = timestamp;
      config.headers.common['api-key'] = await app.$generateApiKey(password, env.api.secret);
      return config;
    },
    (error: AxiosError) => Promise.reject(error),
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      if (!response || !response.data) {
        message.error(SYSTEM_ERROR);
        return Promise.reject(new Error(SYSTEM_ERROR));
      } else {
        const code: any = response.data.head.code;
        if (code !== 'I_00000') {
          const errorMessage = RESPONSE_ERROR[code] || SYSTEM_ERROR;
          message.error(errorMessage);
          return Promise.reject(new Error(errorMessage));
        }
      }
      return response;
    },
    (error: any) => {
      const status: any = error.response.status;
      message.error(STATUS_ERROR[status] || SYSTEM_ERROR);
      return Promise.reject(error);
    },
  );

  injectAxiosToStore(instance);
  inject('axios', instance);
};

export default Axios;
