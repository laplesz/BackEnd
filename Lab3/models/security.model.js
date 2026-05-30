const db = require('./db');

const Security = function Security(security) {
    this.fund_name = security.fund_name;
    this.rating = security.rating;
    this.profitability_for_the_previous_year = security.profitability_for_the_previous_year;
    this.min_transaction_amount = security.min_transaction_amount;
    this.marketability = security.marketability;
};

Security.getAll = async () => {
    return db.query('SELECT * FROM security');
};

Security.create = async newSecurity => {
    const sql = `INSERT INTO security 
        (fund_name, rating, profitability_for_the_previous_year, min_transaction_amount, marketability) 
        VALUES (?, ?, ?, ?, ?)`;
    const params = [
        newSecurity.fund_name,
        newSecurity.rating,
        newSecurity.profitability_for_the_previous_year,
        newSecurity.min_transaction_amount,
        newSecurity.marketability,
    ];
    await db.query(sql, params);
    return newSecurity;
};

Security.remove = async fundName => {
    const result = await db.query('DELETE FROM security WHERE fund_name = ?', [fundName]);
    return result.affectedRows;
};

module.exports = Security;
