const { verifyToken } = require("../authentication/jwt_token");

async function extract_token_user_id(req, res, next) {
  // console.log(req.headers);
  let auth_header = req.headers["authorization"];
  // console.log(auth_header);

  if (!auth_header || auth_header == undefined) {
    req.user_id = "no_id";
    // next();
  } else {
    const token = auth_header.split("Bearer ")[1];
    // console.log(token);

    // Add token for next step (to check if token is blacklisted)-
    req.token = token;

    const token_data = await verifyToken(token);
    // console.log(token_data);

    if (token_data == "err_while_verifying_jwt") {
      req.user_id = "no_id";
    }
    else{

      const user_id = token_data._id;
      req.user_id = user_id;
    };


    // next();
  };
  next();

};

module.exports = { extract_token_user_id };