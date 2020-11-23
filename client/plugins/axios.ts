import { Plugin } from '@nuxt/types';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import * as dayjs from 'dayjs';
import { message } from 'ant-design-vue';
import { injectAxiosToStore } from '../store/axios';

declare module 'vue/types/vue' {
  interface Vue {
    readonly $axios: any;
    readonly $t: any;
    readonly $i18n: any;
  }
}

const Axios: Plugin = ({ env, app }, inject) => {
  const instance: AxiosInstance = axios.create({
    baseURL: '/api',
    withCredentials: true,
  });

  instance.interceptors.request.use(
    async (config: AxiosRequestConfig) => {
      const token: string | null = window.sessionStorage.getItem('IDecs_token');
      const timestamp: number = dayjs().valueOf() * 1000;
      const password: string = timestamp + ':' + config.baseURL + config.url;
      config.headers.common.timestamp = timestamp;
      config.headers.common['api-key'] = await app.$generateApiKey(password, env.api.secret);
      if (token) {
        config.headers.common.Authorization = token;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error),
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      if (!response || !response.data) {
        message.error(app.i18n.t(`COMMON.SYSTEM_ERROR`) as string);
        return Promise.reject(new Error(app.i18n.t(`COMMON.SYSTEM_ERROR`) as string));
      } else {
        const code: any = response.data.head.code;
        if (code !== 'I_00000') {
          if (['I_00009', 'I_00010', 'I_00011'].includes(code)) {
            window.sessionStorage.removeItem('IDecs_token');
            window.location.reload();
          }

          let errorMessage = '';
          if (app.i18n.te(`COMMON.API_ERROR.${code}`)) {
            errorMessage = app.i18n.t(`COMMON.API_ERROR.${code}`) as string;
          } else {
            errorMessage = app.i18n.t(`COMMON.SYSTEM_ERROR`) as string;
          }
          message.error(errorMessage);
          return Promise.reject(new Error(errorMessage));
        }
      }
      return response.data.data;
    },
    (error: any) => {
      const status: any = error.response.status;
      let errorMessage = '';
      if (app.i18n.te(`COMMON.STATUS_ERROR.${status}`)) {
        errorMessage = app.i18n.t(`COMMON.STATUS_ERROR.${status}`) as string;
      } else {
        errorMessage = app.i18n.t(`COMMON.SYSTEM_ERROR`) as string;
      }
      message.error(errorMessage);
      return Promise.reject(error);
    },
  );

  injectAxiosToStore(instance);
  inject('axios', instance);
};

export default Axios;
