import { AxiosInstance } from 'axios';

// eslint-disable-next-line import/no-mutable-exports
let $axios: AxiosInstance;

export function injectAxiosToStore(axiosInstance: AxiosInstance) {
  $axios = axiosInstance;
}

export { $axios };
