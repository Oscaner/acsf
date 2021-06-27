'use strict';

const fs = require('fs-extra');
const yargs = require('yargs');
const utilFinder = require('./utils/finder');
const utilPrint = require('./utils/print');

// Config init.
const configPath = utilFinder.getConfigFilePath();
const config = configPath ? fs.readJSONSync(configPath) : {};

// Env limit.
const envList = ['dev', 'test', 'prod'];

// Basic yargs.
module.exports = yargs
  .config()
  .option('env', {
    describe: 'Which environment want to handle.',
    choices: envList,
    global: true,
  })
  .demandOption('env')
  .string(['dev'])
  .commandDir('commands')
  .demandCommand()
  .help()
  .check((argv) => {
    const configPath = argv.config ? argv.config : utilFinder.getConfigFilePath();
    argv.config = configPath ? fs.readJSONSync(configPath) : {};

    // Checks if the basic auth is not set in (local.)config.json file.
    if (!argv.config.username || !argv.config.password) {
      utilPrint.error('Argument check failed: the basic auth is not set in (local.)config.json file.');
    }

    if (!envList.includes(argv.env)) {
      utilPrint.error(`Argument check failed: the env is not allowed (Allowed: ${envList.join(', ')}).`);
    }

    // Checks if the env is not set in (local.)config.json file.
    if (!(argv.env in argv.config)) {
      utilPrint.error('Argument check failed: the env config is not set in (local.)config.json file.');
    }

    // Checks if the env endpoint is not set in (local.)config.json file.
    const envConfig = argv.config[argv.env];
    if (!('EndpointV1' in envConfig) || !envConfig.EndpointV1) {
      utilPrint.error(`Argument check failed: the ${argv.env} EndpointV1 is not set in (local.)config.json file.`);
    }
    if (!('EndpointV2' in envConfig) || !envConfig.EndpointV2) {
      utilPrint.error(`Argument check failed: the ${argv.env} EndpointV2 is not set in (local.)config.json file.`);
    }

    return true;
  })
  .showHelpOnFail(false)
  .argv;
