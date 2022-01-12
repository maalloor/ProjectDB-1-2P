const spanConfig = require("../config/config.js");
const { Spanner } = require('@google-cloud/spanner');

exports.findAll = async (req, res) => {
    const spanner = new Spanner(spanConfig.projectId);
    const intance = spanner.instance(spanConfig.instanceId);
    const database = intance.database(spanConfig.databaseId);
    const query = { sql: `SELECT seat.seatnumber AS seat_number, flight.flightid AS flight_id
                            FROM flight
                            INNER JOIN flight ON flight.flightid = seat.flightid;` };

    try {
        const [rows] = await database.run(query);
        res.json(rows);
    } catch (err) {
        console.error('ERROR:', err);
    } finally {
        await database.close();
    }
}

exports.findOne = async (req, res) =>{
    const spanner = new Spanner(spanConfig.projectId);
    const intance = spanner.instance(spanConfig.instanceId);
    const database = intance.database(spanConfig.databaseId);

    const query = { sql: `SELECT seat.seatnumber AS seat_number, flight.flightid AS flight_id,
                            seat.seatid AS seat_id, seat.seatcost AS seat_cost
                            FROM seat
                            INNER JOIN flight ON flight.flightid = seat.flightid
                            WHERE flight.flightid = ${req.params.id}`}

    try {
        const [rows] = await database.run(query);
        res.json(rows);
    } catch (err) {
        console.error('ERROR:', err);
    } finally {
        await database.close();
    }
}