'use strict';

async function deleteBackup(instanceId, databaseId, backupId, projectId) {

  const {Spanner} = require('@google-cloud/spanner');
  const spanner = new Spanner({
    projectId: projectId,
  });

  const instance = spanner.instance(instanceId);
  const backup = instance.backup(backupId);


  console.log(`Deleting backup ${backupId}.`);
  await backup.delete();

  const exists = await backup.exists();
  if (exists) {
    console.error('Error: backup still exists.');
  } else {
    console.log('Backup deleted.');
  }
}

module.exports.deleteBackup = deleteBackup;
