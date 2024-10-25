// Hashing plain text password into hash-

const bcrypt = require("bcrypt");
const saltRounds = 10;
// const myPlaintextPassword = "s0/\/\P4$$w0rD";
// const myPlaintextPassword = "krishkhare";
// const someOtherPlaintextPassword = "not_bacon";

const hashPassword = async (PlaintextPassword) => {
    let passwordHash = await bcrypt.hash(PlaintextPassword, saltRounds);
    console.log(passwordHash);
    return passwordHash;
};

const comparePassword = async (PlaintextPassword, passwordHash) => {
    let match = await bcrypt.compare(PlaintextPassword, passwordHash);
    console.log(match);
    return match;
};

// let hPass = hashPassword("yourname");
let hPass = hashPassword("kk@kimail.com");
console.log(hPass);
// let ismatch = comparePassword("yourname", "$2b$10$CLn/TnpVZmvW8OiushKk0.xQpzpfNwd9mJqiEf./4zk3NqXNK7r0m");
let ismatch = comparePassword("kk@kimail.com", "$2b$10$NJj8CqKojnsd6qDVRt.dSuORHE7pAT3CQuqCQQZeBjQknHxsO36d.");
console.log(ismatch);



module.exports = {
    hashPassword,
    comparePassword,
};