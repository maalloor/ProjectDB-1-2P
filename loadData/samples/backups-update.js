'use strict';

async function updateBackup(instanceId, backupId, projectId) {
  const {Spanner} = require('@google-cloud/spanner');
  const {PreciseDate} = require('@google-cloud/precise-date');
  const spanner = new Spanner({
    projectId: projectId,
  });

  const instance = spanner.instance(instanceId);
  const backup = instance.backup(backupId);

  try {
    const currentExpireTime = await backup.getExpireTime();
    const newExpireTime = new PreciseDate(currentExpireTime);
    newExpireTime.setDate(newExpireTime.getDate() + 30);
    console.log(
      `Backup ${backupId} current expire time: ${currentExpireTime.toISOString()}`
    );
    console.log(`Updating expire time to ${newExpireTime.toISOString()}`);
    await backup.updateExpireTime(newExpireTime);
    console.log('Expire time updated.');
  } catch (err) {
    console.error('ERROR:', err);
  }
}

module.exports.updateBackup = updateBackup;
