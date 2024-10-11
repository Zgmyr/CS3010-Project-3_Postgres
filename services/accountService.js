const UserAccountDetailsRepository = require('../repositories/userAccountDetailsRepository');
const logger = require('../logger/logger');

/*
* return 200 and .json of account info if account exists in database
* return 204 if account does not exist
* */
const getAccountDetails = async (request, response) => {
    const { userId } = request.query;
    const userAccountDetailsRepository = new UserAccountDetailsRepository();
    const existingUserAccountDetails = await userAccountDetailsRepository.select(userId);
    if (existingUserAccountDetails) {
        logger.info(`existingUserAccountDetails ${existingUserAccountDetails.first_name}`);
        return response.status(200).json({
            id: existingUserAccountDetails.id,
            userId: existingUserAccountDetails.user_id,
            firstName:existingUserAccountDetails.first_name,
            lastName: existingUserAccountDetails.last_name,
            address1: existingUserAccountDetails.address_1,
            address2:existingUserAccountDetails.address_2,
            city: existingUserAccountDetails.city,
            state: existingUserAccountDetails.state,
            zipCode: existingUserAccountDetails.zip_code,
            phoneNumber: existingUserAccountDetails.phone_number,
            email: existingUserAccountDetails.email
        });
    } else {
        logger.info('No data for that account.');
        return response.status(204).json({});
    }
};

const createAccountDetails = async (request, response) => {
    const {
        userId, firstName, lastName, address1, address2,
        city, state, zipCode, phoneNumber, email
    } = request.body;
    const userAccountDetailsRepository = new UserAccountDetailsRepository();
    const userAccountDetails = await userAccountDetailsRepository.insert(
        userId, firstName, lastName, address1, address2,
        city, state, zipCode, phoneNumber, email
    );
    return response.status(201).json({
        id: userAccountDetails.id
    });
};

/* return '200' and all data from user_account_details' record if it exists & update successful
*  return '404' if no existing record is found for primary user key */
const updateAccountDetails = async (request, response) => {
    const {
        userId, firstName, lastName, address1, address2,
        city, state, zipCode, phoneNumber, email
    } = request.body;
    const userAccountDetailsRepository = new UserAccountDetailsRepository();

    // Check if the user account exists
    const existingUserAccountDetails = await userAccountDetailsRepository.select(userId);

    if (!existingUserAccountDetails) {
        // Return '404' if no existing record is found for that user primary key
        logger.info('No data for that account.');
        return response.status(404).json({ error: 'Record does not yet exist for this account' });
    }

    // Update the existing account details
    await userAccountDetailsRepository.update(
        userId, firstName, lastName, address1, address2,
        city, state, zipCode, phoneNumber, email
    );

    const updatedUserAccountDetails = await userAccountDetailsRepository.select(userId);

    // Return the updated account details
    return response.status(200).json({
        id: updatedUserAccountDetails.id,
        userId: updatedUserAccountDetails.user_id,
        firstName:updatedUserAccountDetails.first_name,
        lastName: updatedUserAccountDetails.last_name,
        address1: updatedUserAccountDetails.address_1,
        address2:updatedUserAccountDetails.address_2,
        city: updatedUserAccountDetails.city,
        state: updatedUserAccountDetails.state,
        zipCode: updatedUserAccountDetails.zip_code,
        phoneNumber: updatedUserAccountDetails.phone_number,
        email: updatedUserAccountDetails.email
    });
};

module.exports = { createAccountDetails, getAccountDetails, updateAccountDetails }