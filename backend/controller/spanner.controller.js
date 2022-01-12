const spanConfig = require("../config/config.js");
const { Spanner } = require('@google-cloud/spanner');

exports.findAll = async (req, res) => {
    const spanner = new Spanner(spanConfig.projectId);
    const intance = spanner.instance(spanConfig.instanceId);
    const database = intance.database(spanConfig.databaseId);
    const query = { sql: `SELECT * FROM flight` };

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

    const query = { sql: `SELECT * FROM flight WHERE flightid = ${req.params.id}`}

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

    const flightTable = database.table("flight");

    try {
        await flightTable.insert({
            flightid: String(req.body.flightid),
            flightsource: String(req.body.flightsource),
            flightdest: String(req.body.flightdest),
            flightdate: req.body.flightdate
        });
        res.send("Vuelo ingresado con exito.");
    } catch (err) {
        console.error("ERROR: ", err);
    } finally {
        await database.close();
    }
}

exports.update = async (req, res) =>{
    const spanner = new Spanner(spanConfig.projectId);
    const intance = spanner.instance(spanConfig.instanceId);
    const database = intance.database(spanConfig.databaseId);

    const flightTable = database.table("flight");
    try {
        await flightTable.update({
            flightid: String(req.body.flightid),
            flightsource: String(req.body.flightsource),
            flightdest: String(req.body.flightdest),
            flightdate: req.body.flightdate
        });
        res.send("Vuelo actualizado con exito.");
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
                sql: `DELETE FROM bookingdetails WHERE bookingid IN (
                    SELECT bookingid FROM (SELECT bookingid FROM booking WHERE flightid=${req.params.id}) AS x);`,
            });
            console.log(`Dato eliminado de flight y bookingdetails.`);
            console.log(rowCount);
        } catch (err) {
            console.error('ERROR1:', err);
        }
        try {
            const [rowCount] = await transaction.runUpdate({
                sql: `DELETE FROM booking WHERE flightid=${req.params.id}`,
            });
            console.log(`Dato eliminado de flight y booking.`);
            console.log(rowCount);
        } catch (err) {
            console.error('ERROR3:', err);
        }
        try {
            const [rowCount] = await transaction.runUpdate({
                sql: `UPDATE seat SET flightid = null WHERE flightid=${req.params.id}`,
            });
            console.log(`Dato eliminado de flight y seat.`);
            console.log(rowCount);
            //await transaction.commit();
        } catch (err) {
            console.error('ERROR4:', err);
        }
        try {
            const [rowCount] = await transaction.runUpdate({
                sql: `DELETE FROM flight WHERE flightid=${req.params.id};`,
            });
            res.send(`Dato eliminado de flight.`);
            console.log(`Dato eliminado de flight.`);
            console.log(rowCount);
            await transaction.commit();
        } catch (err) {
            console.error('ERROR5:', err);
        } finally {
            await database.close();
        }
    });
}