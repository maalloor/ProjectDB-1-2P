const spanConfig = require("../config/config.js");
const { Spanner } = require('@google-cloud/spanner');

exports.findAll = async (req, res) => {
    const spanner = new Spanner(spanConfig.projectId);
    const intance = spanner.instance(spanConfig.instanceId);
    const database = intance.database(spanConfig.databaseId);
    const query = { sql: 'SELECT passid, passname, passemail, passdob FROM passenger' };

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

    const query = { sql: `SELECT passid, passname, passemail, passdob FROM passenger WHERE passid = ${req.params.id}`}

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

    const passengerTable = database.table("passenger");

    try {
        await passengerTable.insert({
            passid: String(req.body.passid),
            passname: String(req.body.passname),
            passemail: String(req.body.passemail),
            passdob: req.body.passdob
        });
        res.send("Pasajero ingresado con exito.");
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

    const passengerTable = database.table("passenger");

    try {
        await passengerTable.update({
            passid: String(req.body.passid),
            passname: String(req.body.passname),
            passemail: String(req.body.passemail),
            passdob: req.body.passdob
        });
        res.send("Pasajero actualizado con exito.");
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
                sql: `DELETE FROM bookingdetails WHERE passid=${req.params.id}`,
            });
            console.log(`Las reservas del pasajero y el pasajero se eliminaron con éxito.`);
        } catch (err) {
            console.error('ERROR:', err);
        }
        // Deletes remaining rows from the Singers table and the Albums table,
        // because Albums table is defined with ON DELETE CASCADE.
        try {
            const [rowCount] = await transaction.runUpdate({
                sql: `DELETE FROM passenger WHERE passid=${req.params.id}`,
            });
            res.send(`La reserva del pasajero y el pasajero se eliminaron con éxito.`);
            await transaction.commit();
        } catch (err) {
            console.error('ERROR:', err);
        } finally {
            await database.close();
        }
    });
}