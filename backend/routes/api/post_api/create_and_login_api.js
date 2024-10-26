// Export create and login post route-

const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const { account } = require("../../../models/accountModel");
const { remove_whitespaces } = require("../../../utils/utils");



// const {
//   createToken,
//   verifyToken,
// } = require("../../../authentication/jwt-token");

module.exports = function (app) {
    app.post("/createAccount", async (req, res) => {
        try {
            const user_email = req.body.user_email;
            const user_email_check = await account.findOne({
                user_email: user_email,
            });
            // console.log(`Email is ${user_email_check.user_email} ...`);

            if (!user_email_check) {
                // let myData = new account(req.body);
                const data = new account({
                    joined: new Date(),
                    full_name: req.body.full_name,
                    user_email: req.body.user_email,
                    user_password: req.body.user_password,

                });

                // const token = await data.generateAuthToken();
                // console.log(`Token is : ${token}`);

                // Setting cookie-
                // res.cookie("ki_jwt_cookie", token, {
                //   httpOnly: true // To make sure that user will not be able to change, remove or client-side scripting on cookie.
                // });

                // await data
                //   .save()
                //   .then(() => {
                //     // res.send("This item has been saved to the database");
                //     // res.redirect("/loginaftercreate");
                //     let new_user = account.findOne({ user_email: req.body.user_email });

                //     res.json({token});

                //     // res.send(encrypt(new_user.id));
                //   })
                //   .catch(() => {
                //     res.status(400).send("Item was not saved to the database");
                //   });

                let new_doc = await data.save();
                const token = await new_doc.generateAuthToken();
                // console.log(`Token is : ${token}`);

                // Setting cookie-
                res.cookie('ki_todo_cookie', token, {

                    expires: new Date(Date.now() + 31104000), // Expires in 1 year

                    // I need js access so commenting I am commenting this-
                    // httpOnly: true, // Prevents JavaScript access

                    // secure: process.env.NODE_ENV === 'production', // Use HTTPS in production

                    // For this we need to set secure: true
                    // sameSite: 'none' // Required for cross-origin cookies

                    // So we are using Lax-
                    sameSite: 'Lax' // Use 'Lax' or 'Strict' for local development

                }).status(200).json('signed_in_successfully');

                // res.json({ token });
                // res.send('signed_up_successfully')

            } else {
                // console.log("Account already exists.");
                res.send("account_already_exists");
            }
        } catch (error) {
            console.log(error);
        }
    });

    // Checking login-
    app.post("/logInToAccount", async (req, res) => {
        try {
            // console.log(req.body);
            const login_email = req.body.login_email;

            // Remove whitespaces-
            const login_password = remove_whitespaces(req.body.login_password);

            const user = await account.findOne(
                { user_email: login_email },
                { user_email: 1, user_password: 1, tokens: 1 }
            );
            // console.log(`Email is ${user.user_email} and password is ${user.user_password}...`);
            // res.send(user); //to visit its database page.

            if (user) {
                // console.log(user.user_password);
                const isPasswordMatch = await bcrypt.compare(
                    login_password,
                    user.user_password
                );
                // console.log(user);
                // console.log(isPasswordMatch);

                // Generating token on login-
                // const token = await user.generateAuthToken();
                // console.log(`Token is : ${token}`);

                if (isPasswordMatch) {
                    // console.log("Match");
                    // let encryptedid = encrypt(user.id);
                    // console.log(encryptedid);
                    // res.send(encryptedid);

                    // Generating token on login-
                    const token = await user.generateAuthToken();
                    console.log(`Token is : ${token}`);

                    // Setting cookie-
                    // res.cookie("ki_todo_cookie", token, {
                    //     // httpOnly: true // To make sure that user will not be able to change, remove or client-side scripting on cookie.
                    // });

                    // return res.cookie("ki_todo_cookie", token, {
                    res.cookie('ki_todo_cookie', token, {

                        expires: new Date(Date.now() + 31104000), // Expires in 1 year

                        // I need js access so commenting I am commenting this-
                        // httpOnly: true, // Prevents JavaScript access

                        // secure: process.env.NODE_ENV === 'production', // Use HTTPS in production

                        // For this we need to set secure: true
                        // sameSite: 'none' // Required for cross-origin cookies

                        // So we are using Lax-
                        sameSite: 'Lax' // Use 'Lax' or 'Strict' for local development

                    }).status(200).json('logged_in_successfully');

                    // res.json({ token });
                    // res.send('logged_in_successfully')

                } else {
                    res.send("user_not_found");
                }
            } else {
                res.send("user_not_found");
            }
        } catch (error) {
            console.log(error);
            res.send("user_not_found");
        }
    });

    // Logout all users-
    //   app.post("/log_out_all_users", restrict_to_logged_in, async (req, res) => {

    //     const user_id = req.user_id;

    //     try {

    //       const user = await account.findOne({ _id: user_id }, { tokens: 1 });
    //       console.log(user);
    //       console.log(user.tokens);

    //       let tokens = user.tokens;

    //       let docs = [];
    //       // Create a docs containing all tokens with user_id-
    //       for (let i = 0; i < tokens.length; i++) {
    //         const curr_token = tokens[i];

    //         let doc = { token: curr_token.token, user_id: user._id };
    //         docs.push(doc);

    //       };

    //       // Prevent additional documents from being inserted if one fails-
    //       const options = { ordered: true };
    //       const bl_all_docs = await blackListToken.insertMany(docs, options);

    //       // Clear token-
    //       const clear_all_tokens = await account.findOneAndUpdate({ _id: user._id }, {
    //         $set: { tokens: [] }
    //       })

    //       res.send("log_out_all_successful_clear_client_token");

    //     } catch (error) {
    //       console.log(error);
    //       res.send("log_out_all_unsuccessfull_try_again");
    //     };

    //   });

};
