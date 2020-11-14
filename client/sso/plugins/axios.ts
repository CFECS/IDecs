import axios from 'axios';
import * as dayjs from 'dayjs';

export default ({ env, app }: any, inject: any) => {
  const instance = axios.create({
    baseURL: '/api/user',
    withCredentials: true,
  });

  instance.interceptors.request.use(
    async (config) => {
      const timestamp: number = dayjs().valueOf() * 1000;
      const password: string = timestamp + ':' + config.baseURL + config.url;
      config.headers.common.timestamp = timestamp;
      config.headers.common['api-key'] = await app.$generateApiKey(password, env.api.secret);
      return config;
    },
    function (error) {
      return Promise.reject(error);
    },
  );

  instance.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      return Promise.reject(error);
    },
  );

  inject('axios', instance);
};
