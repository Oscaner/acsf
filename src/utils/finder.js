'use strict';

const fs = require('fs');
const findUp = require('find-up');

module.exports.getConfigFilePath = () => {
  return findUp.sync(['local.config.json', 'config.json'], { cwd: __dirname });
};

module.exports.getConfigPathFromDirectory = (configName) => {
  const configFolder = findUp.sync(['config'], { type: 'directory', cwd: __dirname });
  if (fs.existsSync(`${configFolder}/${configName}`)) {
    return `${configFolder}/${configName}`;
  }
  return null;
};
