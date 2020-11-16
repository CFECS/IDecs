import axios from 'axios';
import * as dayjs from 'dayjs';
import { message } from 'ant-design-vue';

const DefaultErrorMessage = '服务器发生错误，请联系相关人员~';

const StatusErrorMessage: any = {
  401: '暂无权限操作~',
  504: '网络超时，请稍后再试~',
};

const ResponseErrorMessage: any = {
  I_00003: '用户已存在，请更换用户名~',
  I_00006: '用户不存在，请更换用户名~',
  I_00007: '密码错误，请重新输入~',
};

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
      if (!response || !response.data) {
        message.error(DefaultErrorMessage);
        return Promise.reject(new Error(DefaultErrorMessage));
      } else {
        const code: string = response.data.head.code;
        if (code !== 'I_00000') {
          const errorMessage = ResponseErrorMessage[code] || DefaultErrorMessage;
          message.error(errorMessage);
          return Promise.reject(new Error(errorMessage));
        }
      }
      return response;
    },
    function (error) {
      const status = error.response.status;
      message.error(StatusErrorMessage[status] || DefaultErrorMessage);
      return Promise.reject(error);
    },
  );

  inject('axios', instance);
};
