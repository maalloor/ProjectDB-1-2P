'use strict';

async function getDatabaseOperations(instanceId, projectId) {
  const {Spanner, protos} = require('@google-cloud/spanner');
  const spanner = new Spanner({
    projectId: projectId,
  });

  const instance = spanner.instance(instanceId);

  // List database operations
  try {
    const [databaseOperations] = await instance.getDatabaseOperations({
      filter:
        '(metadata.@type:type.googleapis.com/google.spanner.admin.database.v1.OptimizeRestoredDatabaseMetadata)',
    });
    console.log('Optimize Database Operations:');
    databaseOperations.forEach(databaseOperation => {
      const metadata =
        protos.google.spanner.admin.database.v1.OptimizeRestoredDatabaseMetadata.decode(
          databaseOperation.metadata.value
        );
      console.log(
        `Database ${metadata.name} restored from backup is ` +
          `${metadata.progress.progressPercent}% optimized.`
      );
    });
  } catch (err) {
    console.error('ERROR:', err);
  }
}

module.exports.getDatabaseOperations = getDatabaseOperations;
