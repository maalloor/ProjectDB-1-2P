const spanConfig = require("../config/config.js");
const { Spanner } = require('@google-cloud/spanner');

exports.findAll = async (req, res) => {
    const spanner = new Spanner(spanConfig.projectId);
    const intance = spanner.instance(spanConfig.instanceId);
    const database = intance.database(spanConfig.databaseId);
    const query = { sql: 'SELECT bookingid, passid FROM bookingdetails' };

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

    const query = { sql: `SELECT bookingid, passid FROM bookingdetails WHERE bookingid = ${req.params.id}`}

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

    const bookingdetailsTable = database.table("bookingdetails");

    try {
        await bookingdetailsTable.insert({
            bookingid: String(req.body.bookingid),
            passid: String(req.body.passid)
        });
        res.send("Reserva solicitado por pasajero fue ingresada con exito.");
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

    const bookingdetailsTable = database.table("bookingdetails");

    try {
        await bookingdetailsTable.update({
            bookingid: String(req.body.bookingid),
            passid: String(req.body.passid)
        });
        res.send("Reserva solicitado por pasajero fue actualizado con exito.");
    } catch (err) {
        console.error("ERROR: ", err);
    }
}