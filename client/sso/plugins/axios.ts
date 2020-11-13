import axios from 'axios';
import * as dayjs from 'dayjs';
// import { Utils } from '../../../common/utils';

export default (params: any, inject: any) => {
  const instance = axios.create({
    baseURL: '/api/user',
    withCredentials: true,
  });

  instance.interceptors.request.use(
    function (config) {
      const timestamp = dayjs().valueOf();
      config.headers.common.timestamp = timestamp;
      // config.headers.common['api-key'] = Utils.generateApiKey(timestamp, params.route.path);
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
