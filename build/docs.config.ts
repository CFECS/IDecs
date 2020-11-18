import theme from '@nuxt/content-theme-docs';

export default theme({
  rootDir: 'docs/',
  router: {
    base: '/IDecs/',
  },
  docs: {
    primaryColor: '#4aa271',
  },
  loading: { color: '#4aa271' },
  i18n: {
    locales: () => [
      {
        code: 'zh-CN',
        iso: 'zh-CN',
        file: 'zh-CN.js',
        name: '简体中文',
      },
    ],
    defaultLocale: 'zh-CN',
  },
  content: {
    liveEdit: false,
  },
  pwa: {
    manifest: {
      name: 'IDecs',
    },
  },
});
