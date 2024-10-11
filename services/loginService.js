const UserAccountsRepository = require('../repositories/userAccountsRepository');
const logger = require('../logger/logger');
const bcrypt = require('bcrypt');

const validateLoginCredentials = async (request, response) => {
    const { userName, password } = request.body;
    const userAccountsRepository = new UserAccountsRepository();
    const existingUserAccount = await userAccountsRepository.select(userName);
    if (existingUserAccount) {
        logger.info(`existingUserAccount ${existingUserAccount.user_name}`);
        const isMatch = await bcrypt.compare(password, existingUserAccount.password);
        if (isMatch) {
            const id = existingUserAccount.id;
            logger.info(`Authentication successful!`);
            return response.status(200).json({ id });
        } else {
            const error = `Incorrect Password.`;
            logger.error(error);
            return response.status(401).json({ error });
        }
    } else {
        const error = `${userName} does not have an account, you need to register.`;
        logger.error(error);
        return response.status(400).json({ error });
    }
};

module.exports = validateLoginCredentials;