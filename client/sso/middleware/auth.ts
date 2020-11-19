import { Middleware } from '@nuxt/types';

const Auth: Middleware = (context) => {
  const redirect: any = context.query.redirect || window.sessionStorage.getItem('IDecs_redirect');
  if (!redirect) {
    context.error({ statusCode: 401 });
  } else {
    window.sessionStorage.setItem('IDecs_redirect', redirect);
  }
};

export default Auth;
