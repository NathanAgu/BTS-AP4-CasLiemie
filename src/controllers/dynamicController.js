const database = require('../database');

exports.getTableData = (req, res) => {
    const tableName = req.params.tableName;

    // Vérifier que le nom de la table ne contient que des lettres et chiffres pour éviter l'injection SQL
    if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
        return res.status(400).send('Invalid table name');
    }

    const sql = `SELECT * FROM \`${tableName}\``; // Utilisation des backticks pour éviter les erreurs SQL

    database.query(sql, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error retrieving data from database');
        }
        res.json(results);
    });
};

exports.addTableData = (req, res) => {
    const tableName = req.params.tableName;
    const data = req.body;

    // Vérifier que le nom de la table ne contient que des lettres et chiffres pour éviter l'injection SQL
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

    database.query(sql, Object.values(data), (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error inserting data into database');
        }
        res.status(201).send({ message: 'Data inserted successfully', id: results.insertId });
    });
};

exports.putTableData = (req, res) => {
    const tableName = req.params.tableName;
    const id = req.params.id; // L'identifiant de la ligne à mettre à jour
    const data = req.body;

    // Vérifier que le nom de la table ne contient que des lettres et chiffres pour éviter l'injection SQL
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

    database.query(sql, [...Object.values(data), id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error updating data in database');
        }

        if (results.affectedRows === 0) {
            return res.status(404).send({ message: 'No record found with the given ID' });
        }

        res.status(200).send({ message: 'Data updated successfully' });
    });
};

exports.deleteTableData = (req, res) => {
    const tableName = req.params.tableName;
    const id = req.params.id; // L'identifiant de la ligne à supprimer

    // Vérifier que le nom de la table ne contient que des lettres et chiffres pour éviter l'injection SQL
    if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
        return res.status(400).send('Invalid table name');
    }

    // Vérifier que l'identifiant est valide
    if (!id || isNaN(id)) {
        return res.status(400).send('Invalid or missing ID');
    }

    const sql = `DELETE FROM \`${tableName}\` WHERE id = ?`;

    database.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error deleting data from database');
        }

        if (results.affectedRows === 0) {
            return res.status(404).send({ message: 'No record found with the given ID' });
        }

        res.status(200).send({ message: 'Data deleted successfully' });
    });
};