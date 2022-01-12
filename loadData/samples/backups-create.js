
'use strict';

async function createBackup(
  instanceId,
  databaseId,
  backupId,
  projectId,
  versionTime
) {
  const {Spanner} = require('@google-cloud/spanner');
  const {PreciseDate} = require('@google-cloud/precise-date');

  const spanner = new Spanner({
    projectId: projectId,
  });

  const instance = spanner.instance(instanceId);
  const database = instance.database(databaseId);

  const backup = instance.backup(backupId);

  // Creates a new backup of the database
  try {
    console.log(`Creating backup of database ${database.formattedName_}.`);
    const databasePath = database.formattedName_;
    const expireTime = Date.now() + 1000 * 60 * 60 * 24 * 14;
    const [, operation] = await backup.create({
      databasePath: databasePath,
      expireTime: expireTime,
      versionTime: versionTime,
    });

    console.log(`Waiting for backup ${backup.formattedName_} to complete...`);
    await operation.promise();
    const [backupInfo] = await backup.getMetadata();
    if (backupInfo.state === 'READY') {
      console.log(
        `Backup ${backupInfo.name} of size ` +
          `${backupInfo.sizeBytes} bytes was created at ` +
          `${new PreciseDate(backupInfo.createTime).toISOString()} ` +
          'for version of database at ' +
          `${new PreciseDate(backupInfo.versionTime).toISOString()}`
      );
    } else {
      console.error('ERROR: Backup is not ready.');
    }
  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    await database.close();
  }
}

module.exports.createBackup = createBackup;
