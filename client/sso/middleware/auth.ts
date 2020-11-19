import { Middleware } from '@nuxt/types';

const Auth: Middleware = (context) => {
  // const whiteList: string[] = ['https://typescript.nuxtjs.org/zh-Hans/cookbook/middlewares.html'];
  // const redirect: any = context.query.redirect || window.sessionStorage.getItem('IDecs_redirect');
  // if (!redirect || !whiteList.includes(redirect)) {
  //   context.error({ statusCode: 401 });
  // } else {
  //   window.sessionStorage.setItem('IDecs_redirect', redirect);
  // }
};

export default Auth;
