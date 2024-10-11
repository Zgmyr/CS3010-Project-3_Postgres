const dbClient = require('../db/client');

class UserAccountsRepository {
    constructor() {
    }

    async insert(userName, password) {
        const sql = `INSERT INTO user_accounts (user_name, password) 
                     VALUES ($1, $2)
                     RETURNING id`;
        const values = [userName, password];
        const results = await dbClient.query(sql, values);
        return results.rows[0];
    }

    async select(userName) {
        const sql = `SELECT id, user_name, password FROM user_accounts WHERE user_name = $1`;
        const values = [userName];
        const results = await dbClient.query(sql, values);
        return results.rows[0];
    }
}

module.exports = UserAccountsRepository;