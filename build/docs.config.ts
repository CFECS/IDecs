import theme from '@nuxt/content-theme-docs';

export default theme({
  rootDir: 'docs/',
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
      {
        code: 'en',
        iso: 'en-US',
        file: 'en-US.js',
        name: 'English',
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
