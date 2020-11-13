import { NuxtConfig } from '@nuxt/types';
import { config } from './config';
const project: string = process.env.PROJECT || 'sso';

const nuxtConfig: NuxtConfig = {
  ssr: false,
  telemetry: false,
  srcDir: `client/${project}`,
  env: config,
  loading: { color: '#4aa271' },
  head: {},
  css: ['ant-design-vue/dist/antd.less', '~/assets/styles/main.less'],
  styleResources: {
    less: ['~/assets/styles/variables.less'],
  },
  plugins: ['~/plugins/antd-ui', '~/plugins/axios'],
  components: true,
  buildModules: ['@nuxt/typescript-build', '@nuxtjs/composition-api'],
  modules: ['@nuxtjs/style-resources'],
  axios: {},
  render: {
    bundleRenderer: {
      shouldPreload: (_, type: string) => {
        return ['script', 'style', 'font'].includes(type);
      },
    },
  },
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
  },
};

export default nuxtConfig;
