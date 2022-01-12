'use strict';
//----------------------------------------------------------------------------- ALEATORIOS -------------------------------------------------------------------
function generateFlight(maximo)
{
    var data = [];
    for (var i = 0; i < maximo; i++ )
    {
        data.push({
            flightid: String(i+1),
            flightsource: String(generateSource()),
            flightdest: String(generateDest()),
            flightdate: String(generateFlightDate()),
        });
    }
    return data;
}
function generateSeat(maximo)
{
    const {Spanner} = require('@google-cloud/spanner');
    var data = [];
    for (var i = 0; i < maximo; i++ )
    {
        data.push({
            seatid: String(i+1),
            flightid: String(generateNumber(1,1000)),
            seatnumber: String(generateNumber(1,250)), //IMPORTANTEEEEEEEEEEEEEEEEEEEEEEEEE
            seatcost: Spanner.float(parseFloat(generateFloat(600,1000).toFixed(2))),
        });
    }
    return data;
}
function generatePassenger(maximo)
{
    var data = [];
    for (var i = 0; i < maximo; i++ )
    {
        data.push({
            passid: String(i+1),
            passname: String(generateName()),
            passemail: String(generateEmail()),
            passdob: String(generateDob()),
        });
    }
    return data;
}
function generateBooking(maximo)
{
  var data = [];
  for (var i = 0; i < maximo; i++ )
  {
      data.push({
          bookingid: String(i+1),
          flightid: String(generateNumber(1,1000)),
          seatid: String(i+1),
          bookdate: String(generateBookingDate())
      });
  }
  return data;
}
function generateBookingDetails(maximo)
{
  var data = [];
  for (var i = 0; i < maximo; i++ )
  {
    data.push({
      bookingid: String(i+1),
      passid: String(generateNumber(1,1000))
    });
  }
  return data;
}
function generateNumber(min, max)
{
    var numProbabilities = max - min;
    var random = Math.random() * (numProbabilities + 1);
    random = Math.floor(random);
    return random + min;
}
function generateFloat(min, max)
{
    var numProbabilities = max - min;
    var random = Math.random() * (numProbabilities);
    return random + min;
}
function generateSource()
{
    var choice = new Array("GYE", "QUI", "GAL");
    var random = Math.random() * (choice.length);
    random = Math.floor(random);
    var word = choice[random];
    return word;
}
function generateDest()
{
    var choice = new Array("SLC", "PRV", "MDR", "BAR", "BRL");
    var random = Math.random() * (choice.length);
    random = Math.floor(random);
    var word = choice[random];
    return word;
}
function generateFlightDate()
{
    var date = new Date(2022, generateNumber(1,3), generateNumber(2,31));
    date = `${date.getFullYear()}-${("0"+(date.getMonth()+1)).slice(-2)}-${("0"+date.getDate()).slice(-2)}`
    return date;
}
function generateBookingDate()
{
    var date = new Date(2022, 0, generateNumber(1,31));
    date = `${date.getFullYear()}-${("0"+(date.getMonth()+1)).slice(-2)}-${("0"+date.getDate()).slice(-2)}`
    return date;
}
function generateName()
{
    var pName = "Pasajero "
    var expression = Math.random().toString(36).substring(2,10);
    var result = pName + expression;
    return result;
}
function generateEmail()
{
    var expression = Math.random().toString(36).substring(2,10);
    var choice = new Array("correo.com", "gmail.com", "outlook.com", "outlook.es", "yahoo.com");
    var random = Math.random() * (choice.length);
    random = Math.floor(random);
    var word = choice[random];
    var result = expression+"@"+word;
    return result;
}
function generateDob()
{
    var date = new Date(generateNumber(1980,2004), generateNumber(0,11), generateNumber(20,31));
    date = `${date.getFullYear()}-${("0"+(date.getMonth()+1)).slice(-2)}-${("0"+date.getDate()).slice(-2)}`
    return date;
}

//----------------------------------------------------------------------------------------------------------------------------------------------

async function insertData(instanceId, databaseId, projectId) {
  const {Spanner} = require('@google-cloud/spanner');
  // Crea un cliente Spanner
  const spanner = new Spanner({
    projectId: projectId,
  });
  const instance = spanner.instance(instanceId);
  const database = instance.database(databaseId);
  const flightsTable = database.table('flight');
  const bookingsTable = database.table('booking');
  const passengerTable = database.table('passenger');
  const bookingdetailsTable = database.table('bookingdetails');
  const seatTable = database.table('seat');

  let dataFlights = generateFlight(1000);
  let dataPassengers = generatePassenger(1000);
  let dataBookings = generateBooking(1000);
  let dataBookingsDetails = generateBookingDetails(1000);
  let dataSeats = generateSeat(1000);

  try {
    await flightsTable.insert(dataFlights);
    await seatTable.insert(dataSeats);
    await bookingsTable.insert(dataBookings);
    await passengerTable.insert(dataPassengers);
    await bookingdetailsTable.insert(dataBookingsDetails);
    console.log('Todos los datos fueron ingresados con éxito');
  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    await database.close();
  }
}

require('yargs')
  .demand(1)
  .command(
    'insert <instanceName> <databaseName> <projectId>',
    'Inserts new rows of data into an example Cloud Spanner table.',
    {},
    opts => insertData(opts.instanceName, opts.databaseName, opts.projectId)
  )
  .example('node $0 insert "my-instance" "my-database" "my-project-id"')
  .example('node $0 delete "my-instance" "my-database" "my-project-id"')
  .wrap(120)
  .recommendCommands()
  .epilogue('For more information, see https://cloud.google.com/spanner/docs')
  .strict()
  .help().argv;
