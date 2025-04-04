const database = require('../database');

exports.getTableData = async (req, res) => {
    const tableName = req.params.tableName;

    // Vérifier que le nom de la table est valide
    if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
        return res.status(400).send('Invalid table name');
    }

    const sql = `SELECT * FROM \`${tableName}\``;

    try {
        const [results] = await database.query(sql);
        res.json(results);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Error retrieving data from database');
    }
};

exports.addTableData = async (req, res) => {
    const tableName = req.params.tableName;
    const data = req.body;

    // Vérifier que le nom de la table est valide
    if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
        return res.status(400).send('Invalid table name');
    }

    // Vérifier que les données sont fournies
    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
        return res.status(400).send('Invalid or missing data');
    }

    const columns = Object.keys(data).map(col => `\`${col}\``).join(', ');
    const values = Object.values(data).map(() => '?').join(', ');

    const sql = `INSERT INTO \`${tableName}\` (${columns}) VALUES (${values})`;

    try {
        const [results] = await database.query(sql, Object.values(data));
        res.status(201).send({ message: 'Data inserted successfully', id: results.insertId });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Error inserting data into database');
    }
};

exports.putTableData = async (req, res) => {
    const tableName = req.params.tableName;
    const id = req.params.id;
    const data = req.body;

    // Vérifier que le nom de la table est valide
    if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
        return res.status(400).send('Invalid table name');
    }

    // Vérifier que l'identifiant est valide
    if (!id || isNaN(id)) {
        return res.status(400).send('Invalid or missing ID');
    }

    // Vérifier que les données sont fournies
    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
        return res.status(400).send('Invalid or missing data');
    }

    const updates = Object.keys(data)
        .map(col => `\`${col}\` = ?`)
        .join(', ');

    const sql = `UPDATE \`${tableName}\` SET ${updates} WHERE id = ?`;

    try {
        const [results] = await database.query(sql, [...Object.values(data), id]);
        if (results.affectedRows === 0) {
            return res.status(404).send({ message: 'No record found with the given ID' });
        }
        res.status(200).send({ message: 'Data updated successfully' });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Error updating data in database');
    }
};

exports.deleteTableData = async (req, res) => {
    const tableName = req.params.tableName;
    const id = req.params.id;

    // Vérifier que le nom de la table est valide
    if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
        return res.status(400).send('Invalid table name');
    }

    // Vérifier que l'identifiant est valide
    if (!id || isNaN(id)) {
        return res.status(400).send('Invalid or missing ID');
    }

    const sql = `DELETE FROM \`${tableName}\` WHERE id = ?`;

    try {
        const [results] = await database.query(sql, [id]);
        if (results.affectedRows === 0) {
            return res.status(404).send({ message: 'No record found with the given ID' });
        }
        res.status(200).send({ message: 'Data deleted successfully' });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Error deleting data from database');
    }
};

exports.getByIdTableData = async (req, res) => {
    const tableName = req.params.tableName;
    const id = req.params.id;

    // Vérifier que le nom de la table est valide
    if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
        return res.status(400).send('Invalid table name');
    }

    // Vérifier que l'identifiant est valide
    if (!id || isNaN(id)) {
        return res.status(400).send('Invalid or missing ID');
    }

    const sql = `SELECT * FROM \`${tableName}\` WHERE id = ?`;

    try {
        const [results] = await database.query(sql, [id]);
        if (results.length === 0) {
            return res.status(404).send({ message: 'No record found with the given ID' });
        }
        res.status(200).json(results[0]);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Error retrieving data from database');
    }
};