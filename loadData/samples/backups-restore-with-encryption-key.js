'use strict';

async function restoreBackupWithEncryptionKey(
  instanceId,
  databaseId,
  backupId,
  projectId,
  keyName
) {
  const {Spanner} = require('@google-cloud/spanner');
  const spanner = new Spanner({
    projectId: projectId,
  });

  const instance = spanner.instance(instanceId);
  const database = instance.database(databaseId);

  console.log(
    `Restoring database ${database.formattedName_} from backup ${backupId}.`
  );
  const [, restoreOperation] = await database.restore(
    `projects/${projectId}/instances/${instanceId}/backups/${backupId}`,
    {
      encryptionConfig: {
        encryptionType: 'CUSTOMER_MANAGED_ENCRYPTION',
        kmsKeyName: keyName,
      },
    }
  );

  console.log('Waiting for database restore to complete...');
  await restoreOperation.promise();

  console.log('Database restored from backup.');
  const restoreInfo = await database.getRestoreInfo();
  const [data] = await database.get();
  console.log(
    `Database ${restoreInfo.backupInfo.sourceDatabase} was restored ` +
      `to ${databaseId} from backup ${restoreInfo.backupInfo.backup} ` +
      `using encryption key ${data.metadata.encryptionConfig.kmsKeyName}.`
  );
}

module.exports.restoreBackupWithEncryptionKey = restoreBackupWithEncryptionKey;
