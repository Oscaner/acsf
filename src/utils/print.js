'use strict';

const yargs = require('yargs');
const chalk = require('chalk');

module.exports.error = (msg, cliProgress = null) => {
  if (cliProgress) {
    cliProgress.stop();
  }
  console.error(chalk.red(msg));
  yargs.exit();
};

module.exports.info = (msg) => {
  console.info(chalk.gray(msg));
};

module.exports.warn = (msg) => {
  console.warn(chalk.yellow(msg));
};

module.exports.success = (msg) => {
  console.log(chalk.green(msg));
};
