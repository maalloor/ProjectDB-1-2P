'use strict';

async function restoreBackup(instanceId, databaseId, backupId, projectId) {
  const {Spanner} = require('@google-cloud/spanner');
  const {PreciseDate} = require('@google-cloud/precise-date');
  const spanner = new Spanner({
    projectId: projectId,
  });

  const instance = spanner.instance(instanceId);
  const database = instance.database(databaseId);

  console.log(
    `Restoring database ${database.formattedName_} from backup ${backupId}.`
  );
  const [, restoreOperation] = await database.restore(
    `projects/${projectId}/instances/${instanceId}/backups/${backupId}`
  );

  console.log('Waiting for database restore to complete...');
  await restoreOperation.promise();

  console.log('Database restored from backup.');
  const restoreInfo = await database.getRestoreInfo();
  console.log(
    `Database ${restoreInfo.backupInfo.sourceDatabase} was restored ` +
      `to ${databaseId} from backup ${restoreInfo.backupInfo.backup} ` +
      'with version time ' +
      `${new PreciseDate(restoreInfo.backupInfo.versionTime).toISOString()}.`
  );
}

module.exports.restoreBackup = restoreBackup;
