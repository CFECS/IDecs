import ssoConfig from './build/sso.config';
import docsConfig from './build/docs.config';

const project: string = process.env.PROJECT || 'sso';
const nuxtConfig = project === 'docs' ? docsConfig : ssoConfig;

export default nuxtConfig;
