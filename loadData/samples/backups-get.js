'use strict';

async function getBackups(instanceId, databaseId, backupId, projectId) {
  const {Spanner} = require('@google-cloud/spanner');
  const spanner = new Spanner({
    projectId: projectId,
  });

  const instance = spanner.instance(instanceId);

  try {
    const [allBackups] = await instance.getBackups();
    console.log('All backups:');
    allBackups.forEach(backup => {
      console.log(backup.id);
    });

    const [backupsByName] = await instance.getBackups({
      filter: `Name:${backupId}`,
    });
    console.log('Backups matching backup name:');
    backupsByName.forEach(backup => {
      console.log(backup.id);
    });

    const expireTime = new Date();
    expireTime.setDate(expireTime.getDate() + 30);
    const [backupsByExpiry] = await instance.getBackups({
      filter: `expire_time < "${expireTime.toISOString()}"`,
    });
    console.log('Backups expiring within 30 days:');
    backupsByExpiry.forEach(backup => {
      console.log(backup.id);
    });

    const [backupsByDbName] = await instance.getBackups({
      filter: `Database:${databaseId}`,
    });
    console.log('Backups matching database name:');
    backupsByDbName.forEach(backup => {
      console.log(backup.id);
    });

    const [backupsBySize] = await instance.getBackups({
      filter: 'size_bytes > 100',
    });
    console.log('Backups filtered by size:');
    backupsBySize.forEach(backup => {
      console.log(backup.id);
    });

    const createTime = new Date();
    createTime.setDate(createTime.getDate() - 1);
    const [backupsByCreateTime] = await instance.getBackups({
      filter: `(state:READY) AND (create_time >= "${createTime.toISOString()}")`,
    });
    console.log('Ready backups filtered by create time:');
    backupsByCreateTime.forEach(backup => {
      console.log(backup.id);
    });

    let getBackupsOptions = {
      pageSize: 3,
      gaxOptions: {autoPaginate: false},
    };
    console.log('Get backups paginated:');
    do {
      const [backups, nextQuery] = await instance.getBackups(getBackupsOptions);
      backups.forEach(backup => {
        console.log(backup.id);
      });
      getBackupsOptions = nextQuery;
    } while (getBackupsOptions);
  } catch (err) {
    console.error('ERROR:', err);
  }
}

module.exports.getBackups = getBackups;
