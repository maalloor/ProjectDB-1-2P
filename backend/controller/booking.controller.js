const spanConfig = require("../config/config.js");
const { Spanner } = require('@google-cloud/spanner');

exports.findAll = async (req, res) => {
    const spanner = new Spanner(spanConfig.projectId);
    const intance = spanner.instance(spanConfig.instanceId);
    const database = intance.database(spanConfig.databaseId);
    const query = { sql: `SELECT booking.*
                            FROM bookingdetails
                            INNER JOIN booking ON bookingdetails.bookingid=booking.bookingid` };

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

    const query = { sql: `SELECT booking.*
                            FROM bookingdetails
                            INNER JOIN booking ON bookingdetails.bookingid=booking.bookingid
                            WHERE booking.bookingid = ${req.params.id}`}

    try {
        const [rows] = await database.run(query);
        res.json(rows);
    } catch (err) {
        console.error('ERROR:', err);
    } finally {
        await database.close();
    }
}

exports.new = async (req, res) =>{
    const spanner = new Spanner(spanConfig.projectId);
    const intance = spanner.instance(spanConfig.instanceId);
    const database = intance.database(spanConfig.databaseId);

    const bookingTable = database.table("booking");
    const bookingdetailsTable = database.table("bookingdetails");
    const seatTable = database.table("seat");

    try {
        await bookingTable.insert({
            bookingid: String(req.body.bookingid),
            flightid: String(req.body.flightid),
            seatid: String(req.body.seatid),
            bookdate: req.body.bookdate
        });
        await bookingdetailsTable.insert({
            bookingid: String(req.body.bookingid),
            passid: String(req.body.passid)
        });
        res.send("Reserva ingresada con éxito.");
    } catch (err) {
        console.error("ERROR: ", err);
    } finally {
        // Close the database when finished.
        await database.close();
    }
}

exports.update = async (req, res) =>{
    const spanner = new Spanner(spanConfig.projectId);
    const intance = spanner.instance(spanConfig.instanceId);
    const database = intance.database(spanConfig.databaseId);

    const bookingTable = database.table("booking");
    const seatTable = database.table("seat");
    const bookingdetailsTable = database.table("bookingdetails");
    try {
        await bookingTable.update({
            bookingid: String(req.body.bookingid),
            flightid: String(req.body.flightid),
            seatid: String(req.body.seatid),
            bookdate: req.body.bookdate
        });
        await bookingdetailsTable.update({
            bookingid: String(req.body.bookingid),
            passid: String(req.body.passid)
        });
        res.send("Reserva actualizada con éxito.");
    } catch (err) {
        console.error("ERROR: ", err);
    }
}

exports.delete = async (req, res) =>{
    const spanner = new Spanner(spanConfig.projectId);
    const instance = spanner.instance(spanConfig.instanceId);
    const database = instance.database(spanConfig.databaseId);

    database.runTransaction(async (err, transaction) => {
        if (err) {
            console.error(err);
            return;
        }
        try {
            const [rowCount] = await transaction.runUpdate({
                sql: `DELETE FROM bookingdetails WHERE bookingid=${req.params.id}`,
            });
            console.log(`Registro eliminado de la tabla booking.`);
        } catch (err) {
            console.error('ERROR:', err);
        }
        try {
            const [rowCount] = await transaction.runUpdate({
                sql: `DELETE FROM booking WHERE bookingid=${req.params.id}`,
            });
            res.send(`Registro eliminado de la tabla booking y bookingdetails.`);
            await transaction.commit();
        } catch (err) {
            console.error('ERROR:', err);
        } finally {
            await database.close();
        }
    });
}