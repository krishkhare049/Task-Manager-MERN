const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { JWT_secret_key } = process.env;
const { remove_whitespaces, random_five_digit } = require("../utils/utils");

const saltRounds = 10;


const accountSchema = new mongoose.Schema({

    // User basic data-

    joined: String,
    full_name: String,
    // first_name: String,
    // last_name: String,
    user_email: String,
    user_password: String,
    tasks: Array,

    // Tokens-
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

});


// Generating tokens-
accountSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({
            _id: this._id.toString(),
            random_id: random_five_digit() // just to ensure more uniqueness of token.
        }, JWT_secret_key);
        // console.log(token);
        // console.log(this.tokens);

        // Adding token in token of tokens field.
        this.tokens = this.tokens.concat({ token: token });

        await this.save();

        return token;

    } catch (error) {
        console.log(error);
    };
};


accountSchema.pre("save", async function (next) {

    // If user_password is modified during creation or updating-
    if (this.isModified("user_password")) {
        // const passwordHash = await bcrypt.hash(this.user_password, saltRounds);
        // console.log(`Plain password: ${this.user_password}`);

        // this.user_password = await bcrypt.hash(this.user_password, saltRounds);
        // console.log(`Hash password: ${this.user_password}`);

        let user_password = remove_whitespaces(this.user_password);
        this.user_password = await bcrypt.hash(user_password, saltRounds);
    };

    next();

});

const account = mongoose.model("account", accountSchema);

module.exports = {
    account
};