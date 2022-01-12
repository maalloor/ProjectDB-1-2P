
'use strict';

async function cancelBackup(instanceId, databaseId, backupId, projectId) {
  const {Spanner} = require('@google-cloud/spanner');

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
    // Expire backup one day in the future
    const expireTime = Date.now() + 1000 * 60 * 60 * 24;
    const [, operation] = await backup.create({
      databasePath: databasePath,
      expireTime: expireTime,
    });

    // Cancel the backup
    await operation.cancel();

    console.log('Backup cancelled.');
  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    await backup.delete();

    // Close the database when finished.
    await database.close();
  }
  // [END spanner_cancel_backup_create]
}

module.exports.cancelBackup = cancelBackup;
