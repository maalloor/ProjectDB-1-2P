'use strict';

async function getBackupOperations(instanceId, databaseId, projectId) {

  const {Spanner, protos} = require('@google-cloud/spanner');

  const spanner = new Spanner({
    projectId: projectId,
  });

  const instance = spanner.instance(instanceId);

  try {
    const [backupOperations] = await instance.getBackupOperations({
      filter:
        '(metadata.@type:type.googleapis.com/google.spanner.admin.database.v1.CreateBackupMetadata) ' +
        `AND (metadata.database:${databaseId})`,
    });
    console.log('Create Backup Operations:');
    backupOperations.forEach(backupOperation => {
      const metadata =
        protos.google.spanner.admin.database.v1.CreateBackupMetadata.decode(
          backupOperation.metadata.value
        );
      console.log(
        `Backup ${metadata.name} on database ${metadata.database} is ` +
          `${metadata.progress.progressPercent}% complete.`
      );
    });
  } catch (err) {
    console.error('ERROR:', err);
  }
}

module.exports.getBackupOperations = getBackupOperations;
