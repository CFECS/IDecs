import { NuxtConfig } from '@nuxt/types';
const project: string = process.env.PROJECT || 'sso';

const config: NuxtConfig = {
  ssr: false,
  // Disabled nuxt telemetry
  telemetry: false,
  // base nuxt src dir
  srcDir: `client/${project}`,
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {},
  /*
   ** Global CSS
   */
  css: ['~/assets/styles/main.less'],

  styleResources: {
    less: ['~/assets/styles/variables.less'],
  },
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: ['~/plugins/antd-ui'],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxt/typescript-build'],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/style-resources',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},

  render: {
    bundleRenderer: {
      shouldPreload: (_, type: string) => {
        return ['script', 'style', 'font'].includes(type);
      },
    },
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
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
    babel: {
      babelrc: true,
      plugins: [
        [
          'import',
          {
            libraryName: 'ant-design-vue',
            libraryDirectory: 'es',
            style: true,
          },
        ],
      ],
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

export default config;
