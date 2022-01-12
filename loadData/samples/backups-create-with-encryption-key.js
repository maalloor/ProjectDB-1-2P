
'use strict';

async function createBackupWithEncryptionKey(
  instanceId,
  databaseId,
  backupId,
  projectId,
  keyName
) {
  const {Spanner} = require('@google-cloud/spanner');
  const {PreciseDate} = require('@google-cloud/precise-date');
  const spanner = new Spanner({
    projectId: projectId,
  });

  // Gets a reference to a Cloud Spanner instance and database
  const instance = spanner.instance(instanceId);
  const database = instance.database(databaseId);

  const backup = instance.backup(backupId);

  // Creates a new backup of the database
  try {
    console.log(`Creating backup of database ${database.formattedName_}.`);
    const databasePath = database.formattedName_;
    // Expire backup 14 days in the future
    const expireTime = Date.now() + 1000 * 60 * 60 * 24 * 14;
    // Create a backup of the state of the database at the current time.
    const [, operation] = await backup.create({
      databasePath: databasePath,
      expireTime: expireTime,
      encryptionConfig: {
        encryptionType: 'CUSTOMER_MANAGED_ENCRYPTION',
        kmsKeyName: keyName,
      },
    });

    console.log(`Waiting for backup ${backup.formattedName_} to complete...`);
    await operation.promise();

    // Verify backup is ready
    const [backupInfo] = await backup.getMetadata();
    if (backupInfo.state === 'READY') {
      console.log(
        `Backup ${backupInfo.name} of size ` +
          `${backupInfo.sizeBytes} bytes was created at ` +
          `${new PreciseDate(backupInfo.createTime).toISOString()} ` +
          `using encryption key ${backupInfo.encryptionInfo.kmsKeyVersion}`
      );
    } else {
      console.error('ERROR: Backup is not ready.');
    }
  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    // Close the database when finished.
    await database.close();
  }
}

module.exports.createBackupWithEncryptionKey = createBackupWithEncryptionKey;
