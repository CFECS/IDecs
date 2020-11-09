import { readFileSync } from 'fs';
import { safeLoad } from 'js-yaml';

const getConfig = () => {
  return safeLoad(readFileSync(`${__dirname}/default.yml`, 'utf8'));
};

export const config: any = getConfig();
