const express = require('express');
const app = express();
const cors = require('cors');
const registerLoginCredentials = require("./services/registerService");
const validateLoginCredentials = require("./services/loginService");
const {getAccountDetails, createAccountDetails, updateAccountDetails} = require("./services/accountService");
const port = 8080;

//Simple request time logger
app.use(
    (request, response, next) => {
        console.log("A new request received at " + new Date(Date.now()));
        next();
    }
);

app.use(express.json());
app.use(cors());

/* For Posting Login Credentials to Postgres */
app.post('/login', (request, response) => {
    console.log(request.body);
    /*
    Return 200 and return the primary key of the user account if comparison check passes.
    Return 400 if no user account exists.
    Return 401 if comparison check fails.
    */
    validateLoginCredentials(request,response);
});

/* For Posting Registration Credentials to Postgres */
app.post('/registration', (request, response) => {
    console.log(request.body);
    /*
    * Return 201 and return the primary key of the newly created user account.
    * Return 409 if that username already has a user account.
    */
    registerLoginCredentials(request,response);
});

/* Create New Record for Account Information */
app.post('/account', (request, response) => {
    console.log(request.body);
    // Return 201 and return the newly created data entry.
    createAccountDetails(request,response);
});

/* For Getting Account Information (upon loading page)
* Return 200 and return all the data from the user_account_details record for that user
* Return 204 if there is no data in the user_account_details for that user */
app.get('/account', (request, response) =>
    getAccountDetails(request,response));

/* For Updating Account Information */
/* Return 200 and return all the data from the user_account_details record for that user
 * Return 404 if no existing record is found for that user primary key*/
app.put('/account', (request,response) =>
    updateAccountDetails(request,response));




app.listen(port, () => {
    console.log(`Tutorial app listening on port ${port}`);
});

// node .\app.js