'use strict';

const utilPrint = require('../utils/print');
const {
  getSites, staging,
} = require('../apis');

module.exports = {
  command: 'staging [options]',
  desc: 'Staging sites for ACSF',
  builder: (yargs) => {
    return yargs
      .option('target', {
        describe: 'Staging target sites, split with commas.',
        global: false,
        conflicts: 'all',
      })
      .option('all', {
        describe: 'Staging all sites.',
        global: false,
        conflicts: ['target'],
      })
      .option('wipe', {
        describe: 'Wipe target environment',
        global: false,
      })
      .string(['target'])
      .boolean(['all', 'wipe']);
  },
  handler: async (argv) => {
    await stagingHandler(argv);
  },
};

const stagingHandler = async (argv) => {
  // Env configuration.
  const env = argv.env;
  const prodEnvConfig = argv.config.prod;

  const endpointV1 = prodEnvConfig.EndpointV1;
  const endpointV2 = prodEnvConfig.EndpointV2;
  const username = argv.config.username;
  const password = argv.config.password;

  // Wipe target environment.
  const wipe = !!argv.wipe;
  // Target site.
  const targetSites = argv.target ? argv.target.split(',') : [];

  // Flag: all.
  const isALL = argv.all;

  // Get all sites information from ACSF.
  const sites = await getSites(endpointV1, username, password);

  // Allowed sites.
  const allowedSites = isALL ? sites : Object.keys(sites).reduce((accumulator, siteName) => {
    if (targetSites.includes(siteName)) {
      accumulator[siteName] = sites[siteName];
    }
    return accumulator;
  }, {});

  try {
    // Site ids.
    const siteIds = Object.values(allowedSites).map((site) => {
      return site.id;
    });

    if (siteIds.length === 0) {
      utilPrint.warn('Sites was empty.');
      return;
    }

    await staging(endpointV2, username, password, env, siteIds, wipe);

    utilPrint.success(`Succeed sites: ${Object.keys(allowedSites).join(', ')}`);
  }
  catch (error) {
    utilPrint.error(`Error message: ${error.message}`);
  }
};
