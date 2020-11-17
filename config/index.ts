import { readdirSync, readFileSync } from 'fs';
import { safeLoad } from 'js-yaml';

const getConfig = () => {
  const configFiles = readdirSync(__dirname);
  const configs = [];
  const localConfigs = [];
  for (const filename of configFiles) {
    if (filename.endsWith('.yml') || filename.endsWith('.yaml')) {
      const cof: any = safeLoad(readFileSync(`${__dirname}/${filename}`, 'utf8'));
      if (filename.endsWith('.local.yml') || filename.endsWith('.local.yaml')) {
        localConfigs.push(cof);
      } else {
        configs.push(cof);
      }
    }
  }
  return Object.assign({}, ...configs, ...localConfigs);
};

export const config: any = getConfig();
