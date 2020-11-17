import { readFileSync } from 'fs';
import { safeLoad } from 'js-yaml';

const getConfig = () => {
  const defaultConfig: any = safeLoad(readFileSync(`${__dirname}/default.yml`, 'utf8'));
  const localConfig: any = safeLoad(readFileSync(`${__dirname}/default.local.yml`, 'utf8'));
  return { ...defaultConfig, ...localConfig };
};

export const config: any = getConfig();
