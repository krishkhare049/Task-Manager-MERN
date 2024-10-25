// const { blackListToken } = require("../models/blackListTokens_model");

async function restrict_to_logged_in(req, res, next) {
    // console.log("Restrict to logged in user");
    if (req.user_id == "no_id") {
        res.send("log_in_to_access_data");
    }
    else {

        // Check if token is blacklisted or not-
        // const token_blacklisted = await blackListToken.findOne({ token: req.token });

        // if (token_blacklisted) {
        //     console.log("Token is blacklisted");
        //     res.send("log_in_to_access_data");
        // }
        // else {
            next();
        // };
    };
};

module.exports = { restrict_to_logged_in };