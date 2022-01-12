'use strict';

async function createDatabase(instanceId, databaseId, projectId) {
  const {Spanner} = require('@google-cloud/spanner');
  const spanner = new Spanner({
    projectId: projectId,
  });
  const instance = spanner.instance(instanceId);
  const request = {
    schema: [
      `CREATE TABLE flight (
        flightid    INT64 NOT NULL,
        flightsource   STRING(20) NOT NULL,
        flightdest    STRING(20) NOT NULL,
        flightdate  DATE NOT NULL
      ) PRIMARY KEY (flightdate, flightid)`,
      `CREATE TABLE seat (
        seatid     INT64 NOT NULL,
        flightid   INT64,
        seatnumber    INT64 NOT NULL,
        seatcost   FLOAT64 NOT NULL,
        CONSTRAINT FK_Seat_Flight FOREIGN KEY (flightid) REFERENCES flight (flightid)
      ) PRIMARY KEY (seatnumber, seatid)`,
      `CREATE TABLE booking (
        bookingid    INT64 NOT NULL,
        seatid       INT64,
        flightid     INT64 NOT NULL,
        bookdate  DATE NOT NULL,
        CONSTRAINT FK_Booking_Flight FOREIGN KEY (flightid) REFERENCES flight (flightid),
        CONSTRAINT FK_Booking_Seat FOREIGN KEY (seatid) REFERENCES seat (seatid),
      ) PRIMARY KEY (bookdate DESC, seatid, flightid, bookingid)`,
      `CREATE TABLE passenger (
        passid    INT64 NOT NULL,
        passname   STRING(50) NOT NULL,
        passemail  STRING(50),
        passdob DATE NOT NULL
      ) PRIMARY KEY (passdob DESC, passid)`,
      `CREATE TABLE bookingdetails (
        bookingid    INT64 NOT NULL,
        passid     INT64 NOT NULL,
        CONSTRAINT FK_Bookingdetails_Booking FOREIGN KEY (bookingid) REFERENCES booking (bookingid),
        CONSTRAINT FK_Bookingdetails_Passenger FOREIGN KEY (passid) REFERENCES passenger (passid)
      ) PRIMARY KEY (passid, bookingid)`
    ],
  };

  const [database, operation] = await instance.createDatabase(
    databaseId,
    request
  );
  console.log(`Esperando para que la operación en ${database.id} sea completada...`);
  await operation.promise();
  console.log(`Base de datos ${databaseId} creada en la instancia ${instanceId}.`);
}

require('yargs')
  .demand(1)
  .command(
    'createDatabase <instanceName> <databaseName> <projectId>',
    'Creates an example database with two tables in a Cloud Spanner instance.',
    {},
    opts => createDatabase(opts.instanceName, opts.databaseName, opts.projectId)
  )
  .example('node $0 createDatabase "my-instance" "my-database" "my-project-id"')
  .wrap(120)
  .recommendCommands()
  .epilogue('For more information, see https://cloud.google.com/spanner/docs')
  .strict()
  .help().argv;
