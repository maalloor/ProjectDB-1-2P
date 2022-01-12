const spanConfig = require("../config/config.js");
const { Spanner } = require('@google-cloud/spanner');

exports.findAll = async (req, res) => {
    const spanner = new Spanner(spanConfig.projectId);
    const intance = spanner.instance(spanConfig.instanceId);
    const database = intance.database(spanConfig.databaseId);
    const query = { sql: `SELECT booking.bookingid AS booking_id, booking.flightid AS flight_id,
                            passenger.passid AS pass_id, passenger.passname AS pass_name,
                            booking.bookdate AS book_date, flight.flightdest AS flight_dest, flight.flightdate AS flight_date,
                            seat.seatcost AS seat_cost
                            FROM bookingdetails
                            JOIN booking ON bookingdetails.bookingid = booking.bookingid
                            JOIN passenger ON bookingdetails.passid = passenger.passid
                            JOIN seat ON booking.seatid = seat.seatid
                            JOIN flight ON booking.flightid = flight.flightid`};

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

    const query = { sql: `SELECT booking.bookingid AS booking_id, booking.flightid AS flight_id,
                            passenger.passid AS pass_id, passenger.passname AS pass_name,
                            booking.bookdate AS book_date, flight.flightdest AS flight_dest, flight.flightdate AS flight_date,
                            seat.seatid AS seat_id, seat.seatcost AS seat_cost
                            FROM bookingdetails
                            INNER JOIN booking ON bookingdetails.bookingid=booking.bookingid
                            INNER JOIN passenger ON bookingdetails.passid=passenger.passid
                            INNER JOIN flight ON booking.flightid = flight.flightid
                            INNER JOIN seat ON booking.seatid = seat.seatid
                            WHERE booking.bookingid = ${req.params.id}`};

    try {
        const [rows] = await database.run(query);
        res.json(rows);
    } catch (err) {
        console.error('ERROR:', err);
    } finally {
        await database.close();
    }
}