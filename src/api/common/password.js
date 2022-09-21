const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto")

/**
 * decode JWT token
 */
exports.decode = async (token) => {
    return jwt.decode(token, process.env.JWT_SEC);
};

let algorithm = 'aes-256-cbc';
let password = 'password';
exports.encrypt = (text) => {
    const cipher = crypto.createCipher(algorithm, password);
    var crypted = cipher.update(text.toString(), 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
};

exports.generateToken = async (payload) => {
    const token = await jwt.sign(payload, process.env.JWT_SEC, {
        expiresIn: "1d",
    });
    return token;
};
/**
 * Compare the password using bcryptjs algo
 */
exports.comparePassword = async (password, hash) =>
    await bcrypt.compare(password, hash);

/**
* Generates Hash of a password string
*/
//exports.encryptPassword = async (password) => bcrypt.hashSync(password, 10);


/**
* Generates salt
*/
exports.generateSalt = (length = 10) => {
    return bcrypt.genSaltSync(length);
};

/**
* Generates encryptPassword
*/
exports.encryptPassword = (password, salt) => {
    return bcrypt.hashSync(password, salt);
};