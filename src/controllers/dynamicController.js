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