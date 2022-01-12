const spanConfig = require("../config/config.js");
const { Spanner } = require('@google-cloud/spanner');

exports.findAll = async (req, res) => {
    const spanner = new Spanner(spanConfig.projectId);
    const intance = spanner.instance(spanConfig.instanceId);
    const database = intance.database(spanConfig.databaseId);
    const query = { sql: 'SELECT * FROM seat' };

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

    const query = { sql: `SELECT * FROM seat WHERE seatid = ${req.params.id}`}

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

    const passengerTable = database.table("seat");

    try {
        await passengerTable.insert({
            seatid: String(req.body.seatid),
            flightid: String(req.body.flightid),
            seatnumber: String(req.body.seatnumber),
            seatcost: Spanner.float(parseFloat(req.body.seatcost))
        });
        res.send("Asiento ingresado con exito.");
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

    const passengerTable = database.table("seat");

    try {
        await passengerTable.update({
            seatid: String(req.body.seatid),
            flightid: String(req.body.flightid),
            seatnumber: String(req.body.seatnumber),
            seatcost: Spanner.float(parseFloat(req.body.seatcost))
        });
        res.send("Asiento actualizado con exito.");
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
                sql: `DELETE FROM booking WHERE seatid=${req.params.id}`,
            });
            console.log(`La reserva con este asiento fue eliminada con éxito.`);
        } catch (err) {
            console.error('ERROR:', err);
        }
        try {
            const [rowCount] = await transaction.runUpdate({
                sql: `DELETE FROM seat WHERE seatid=${req.params.id}`,
            });
            res.send(`La reserva con este asiento fue eliminada con éxito.`);
            await transaction.commit();
        } catch (err) {
            console.error('ERROR:', err);
        } finally {
            await database.close();
        }
    });
}