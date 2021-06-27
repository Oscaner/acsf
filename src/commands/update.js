'use strict';

const utilPrint = require('../utils/print');
const { update } = require('../apis');

module.exports = {
  command: 'update [options]',
  desc: 'Update code for ACSF sites',
  builder: (yargs) => {
    return yargs
      .option('update-type', {
        describe: 'The type of code update you want to deploy',
        choices: ['code', 'code, db'],
        global: false,
      })
      .option('vcs', {
        describe: 'Choose a path to deploy...',
        global: false,
      })
      .string(['update-type', 'vcs']);
  },
  handler: async (argv) => {
    await updateHandler(argv);
  },
};

const updateHandler = async (argv) => {
  // Env configuration.
  const envConfig = argv.config[argv.env];

  const endpointV1 = envConfig.EndpointV1;
  const username = argv.config.username;
  const password = argv.config.password;

  if (!argv.vcs || !argv.updateType) {
    utilPrint.warn('The vcs or update-type was empty.');
    return;
  }

  try {
    const response = await update(endpointV1, username, password, argv.vcs, argv.updateType);
    utilPrint.success(
      `Successfully to trigger update code [${argv.vcs}] with [${argv.updateType}], task id is ${response.body.task_id}.`,
    );
  }
  catch (error) {
    utilPrint.error(`Error message: ${error.message}`);
  }
};
