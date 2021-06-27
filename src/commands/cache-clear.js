'use strict';

const cliProgress = require('cli-progress');
const utilPrint = require('../utils/print');
const { getCollections, cacheClear } = require('../apis');

module.exports = {
  command: ['cache-clear [options]', 'cr [options]'],
  desc: 'Clear varnish cache for ACSF collections',
  builder: (yargs) => {
    return yargs
      .option('target', {
        describe: 'Handle target collection.',
        global: false,
        conflicts: 'all',
      })
      .option('all', {
        describe: 'Handle all collections.',
        global: false,
        conflicts: 'target',
      })
      .string(['target'])
      .boolean(['all']);
  },
  handler: async (argv) => {
    await cacheClearHandler(argv);
  },
};

const cacheClearHandler = async (argv) => {
  // Env configuration.
  const envConfig = argv.config[argv.env];

  const endpoint = envConfig.EndpointV1;
  const username = argv.config.username;
  const password = argv.config.password;

  // Target site.
  const targetCollection = argv.target;

  // Flag: all.
  const isALL = argv.all;

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

      if (!(collectionName in collections)) {
        utilPrint.error(`Not found the site config: [${collectionName}].\n`, bar);
      }

      // Site primary id.
      const siteId = collections[collectionName].primary_site;

      // Varnish cache clear.
      await cacheClear(endpoint, username, password, siteId);

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
