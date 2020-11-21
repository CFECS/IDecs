import { readFileSync } from 'fs';
import { safeLoad } from 'js-yaml';
import { NuxtConfig } from '@nuxt/types';
import { config } from '../config';

const nuxtConfig: NuxtConfig = {
  ssr: false,
  telemetry: false,
  target: 'static',
  srcDir: 'client',
  components: true,
  env: config,
  loading: { color: '#4aa271' },
  css: ['ant-design-vue/dist/antd.less', '~/styles/main.less'],
  styleResources: {
    less: ['~/styles/variables.less'],
  },
  plugins: ['~/plugins/antd-ui', '~/plugins/axios', '~/plugins/tools'],
  buildModules: ['@nuxt/typescript-build'],
  modules: [
    '@nuxtjs/style-resources',
    [
      'nuxt-i18n',
      {
        strategy: 'no_prefix',
        detectBrowserLanguage: {
          useCookie: true,
          alwaysRedirect: true,
          cookieKey: 'IDecs_i18n',
        },
        defaultLocale: 'en',
        locales: ['en', 'zh-cn'],
        vueI18n: {
          fallbackLocale: 'en',
          messages: {
            en: safeLoad(readFileSync('./client/locales/en.yaml', 'utf8')),
            'zh-cn': safeLoad(readFileSync('./client/locales/zh-cn.yaml', 'utf8')),
          },
        },
      },
    ],
  ],
  build: {
    extractCSS: true,
    optimizeCSS: true,
    optimization: {
      splitChunks: {
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.(css)$/,
            chunks: 'all',
            enforce: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/](ant-design-vue)[\\/]/,
            name: 'vendor',
            chunks: 'all',
          },
          vendor2: {
            test: /[\\/]node_modules[\\/](@ant-design)[\\/]/,
            name: 'vendor2',
            chunks: 'all',
          },
          default: {
            chunks: 'all',
            priority: -20,
          },
        },
      },
    },
    transpile: [/ant-design-vue/],
    loaders: {
      imgUrl: { limit: 1000 },
      less: {
        javascriptEnabled: true,
        modifyVars: {
          'primary-color': '#4aa271',
        },
      },
    },
    extend(config: any) {
      config.module.rules.push({
        test: /\.ya?ml$/,
        use: 'js-yaml-loader',
      });
    },
  },
};

export default nuxtConfig;
