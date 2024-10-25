
// Configuring environment variables-
require('dotenv').config()

//Connect with database-
require('./config/database').connect()

const express = require('express')
const cors = require('cors')
const compression = require("compression");
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser')

const {extract_token_user_id} = require('./middlewares/extract_token_user_id')

const app = express()

// Handle post requests-
app.use(express.json())

// cookies parser-
app.use(cookieParser())

// Handle put requests-
app.use(methodOverride("_method"));


// Compress all responses-
// Using it will give error on image/video loading (not in this Todo app)-
app.use(compression({
    level: 9,
    threshold: 0,
    filter: (req, res) => {
        if (req.headers["x-no-compression"]) {
            return false;
        }
        return compression.filter(req, res)
    }
}));


// Cors
// const whitelist = ["http://localhost:5000", "https://mernTodo.com", "http://127.0.0.1:5500", "http://127.0.0.1"];
const whitelist = ["http://localhost:5173"];

let corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        }
        else {
            // callback(new Error("Not allowed by CORS"))
            callback(null, false);
        };
    },
    credentials: true
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // include before other routes

// Extract token and user_id-
app.use(extract_token_user_id);


// GET ROUTES-
require("./routes/api/get_api/getUserTasks")(app);
require("./routes/api/get_api/getUserData")(app);

// POST ROUTES-
require("./routes/api/post_api/create_and_login_api")(app);
require("./routes/api/post_api/tasks_update_delete_more_api")(app);
require("./routes/api/post_api/user_data_post_api")(app);

module.exports = app;
