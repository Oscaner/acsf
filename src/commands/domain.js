'use strict';

const fs = require('fs-extra');
const path = require('path');
const cliProgress = require('cli-progress');
const utilCommon = require('../utils/common');
const utilFinder = require('../utils/finder');
const utilPrint = require('../utils/print');
const {
  getCollections, getDomains, addDomain, removeDomain,
} = require('../apis');

module.exports = {
  command: 'domain [options]',
  desc: 'Setup domains for ACSF collections',
  builder: (yargs) => {
    return yargs
      .option('list', {
        describe: 'Provid a json file of domain list.',
        global: false,
      })
      .option('add', {
        describe: 'Add a domain for target collection.',
        global: false,
        conflicts: ['reset', 'all'],
        implies: ['target'],
      })
      .option('remove', {
        describe: 'remove a domain for target collection.',
        global: false,
        conflicts: ['reset', 'all'],
        implies: ['target'],
      })
      .option('target', {
        describe: 'Handle target collection.',
        global: false,
        conflicts: 'all',
      })
      .option('reset', {
        describe: 'Focus reset domains for the target collections',
        global: false,
        conflicts: ['add', 'remove'],
      })
      .option('all', {
        describe: 'Handle all collections.',
        global: false,
        conflicts: ['add', 'remove', 'target'],
        implies: ['reset'],
      })
      .string(['list', 'add', 'remove', 'target'])
      .boolean(['reset', 'all']);
  },
  handler: async (argv) => {
    await domainHandler(argv);
  },
};

const domainHandler = async (argv) => {
  // Env configuration.
  const envConfig = argv.config[argv.env];

  const endpoint = envConfig.EndpointV1;
  const username = argv.config.username;
  const password = argv.config.password;

  // Domain configuration.
  const domainConfigPath = argv.list ? path.resolve(argv.list) : utilFinder.getConfigPathFromDirectory('domain.json');
  const domainConfig = domainConfigPath ? fs.readJSONSync(domainConfigPath) : {};
  const envDomainConfig = (argv.env in domainConfig) && domainConfig[argv.env] ? domainConfig[argv.env] : {};

  // Add domain.
  const addDomainString = argv.add;
  // Remove domain.
  const removeDomainString = argv.remove;
  // Target site.
  const targetCollection = argv.target;

  // Flag: reset.
  const isReset = argv.reset;

  // Flag: all.
  const isALL = argv.all;

  // Checks, no action for target domain.
  if (targetCollection && !addDomainString && !removeDomainString && !isReset) {
    utilPrint.error('No action for target domain, use \'--add\', \'--delete\' or \'--reset\'.');
  }

  // Get all collections information from ACSF.
  const collections = await getCollections(endpoint, username, password);

  // Allowed collections.
  const allowedCollections = isALL ? Object.keys(collections) : [targetCollection];

  // Checks, not handle for all collections, but the command want to handle more than one site.
  if (targetCollection && allowedCollections.length > 1) {
    utilPrint.error(`The command want to handle more than one collection, it's right?\nHandle collections: ${allowedCollections.join(', ')}.`);
  }

  // CLI progress.
  const bar = new cliProgress.SingleBar({}, cliProgress.Presets.rect);

  // Temporary variables.
  let tempCollectionName = '';
  const tempSucceedCollectionNames = [];
  let start = 0;

  try {
    bar.start(allowedCollections.length, start);

    // Handle allowed collections.
    for (const collectionName of allowedCollections) {
      tempCollectionName = collectionName;

      // Site information.
      const collectionConfig = collectionName in collections ? collections[collectionName] : {};
      const collectionId = collectionConfig.id;

      if (!(collectionName in collections)) {
        utilPrint.error(`Not found the site config: [${collectionName}].\n`, bar);
      }

      // Add domain.
      if (typeof addDomainString === 'string' && addDomainString) {
        await addDomain(endpoint, username, password, collectionId, addDomainString);
      }

      // Remove domain.
      if (typeof removeDomainString === 'string' && removeDomainString) {
        await removeDomain(endpoint, username, password, collectionId, removeDomainString);
      }

      // Reset.
      if (isReset && (collectionName in envDomainConfig)) {
        // Get custom domain from Online.
        const onlineDomains = await getDomains(endpoint, username, password, collectionId);
        const customOnlineDomains = onlineDomains.custom_domains ? onlineDomains.custom_domains : [];

        // Remove all domains.
        // ACSF cannot handle concurrent delete, so need for loop to delete.
        for (const customOnlineDomain of customOnlineDomains) {
          await removeDomain(endpoint, username, password, collectionId, customOnlineDomain);
        }

        // Waiting for ACSF cloud: Remove domain [DOMAIN] from [ENV].
        await utilCommon.sleep(5000);

        // Get custom domain from Local.
        const customLocalDomains = envDomainConfig[collectionName];

        // Add all domains.
        // Domains have order, so need for loop to add.
        for (const customLocalDomain of customLocalDomains) {
          await addDomain(endpoint, username, password, collectionId, customLocalDomain);
        }
      }

      // Temporary variables.
      tempSucceedCollectionNames.push(collectionName);
      start += 1;

      bar.update(start);
    }

    bar.stop();

    utilPrint.success(`Succeed collections: ${allowedCollections.join(', ')}`);
  }
  catch (error) {
    utilPrint.error(`Succeed collections: ${tempSucceedCollectionNames.join(', ')}\nError collection: [${tempCollectionName}]\n${error.message}`, bar);
  }
};
