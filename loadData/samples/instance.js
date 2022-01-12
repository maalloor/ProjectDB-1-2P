'use strict';

async function createInstance(instanceId, projectId) {
  const {Spanner} = require('@google-cloud/spanner');
  const spanner = new Spanner({
    projectId: projectId,
  });

  const instance = spanner.instance(instanceId);

  try {
    console.log(`Creating instance ${instance.formattedName_}.`);
    const [, operation] = await instance.create({
      config: 'regional-us-central1',
      nodes: 1,
      displayName: 'This is a display name.',
      labels: {
        ['cloud_spanner_samples']: 'true',
        created: Math.round(Date.now() / 1000).toString(),
      },
    });

    console.log(`Esperando a que la operación en ${instance.id} sea completada...`);
    await operation.promise();

    console.log(`Se creó la instancia ${instanceId}.`);
  } catch (err) {
    console.error('ERROR:', err);
  }
}

require('yargs')
  .demand(1)
  .command(
    'createInstance <instanceName> <projectId>',
    'Creates an example instance in a Cloud Spanner instance.',
    {},
    opts => createInstance(opts.instanceName, opts.projectId)
  )
  .example('node $0 createInstance "my-instance" "my-project-id"')
  .wrap(120)
  .recommendCommands()
  .epilogue('For more information, see https://cloud.google.com/spanner/docs')
  .strict()
  .help().argv;
