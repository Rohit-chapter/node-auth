const jwt = require("jsonwebtoken");
const User = require("../models/user")
const dotenv = require("dotenv");
dotenv.config();

const verifyToken = async (req, res, next) => {
    try {
        const {
            headers: { authorization },
        } = req;
        const token = authorization.split(" ")[1];
        const { id } = await decode(token);
        const userDetails = await User.findById(id);
        if (!userDetails) {
            return res.status(404).json({
                message: "user not found",
            });
        }
        req.userId = id;
        next();
    } catch (error) {
        return res.status(500).json(
            {
                message: "invalid token",
            });
    }
};

const decode = async (token) => {
    return await jwt.decode(token, process.env.JWT_SEC);
};

module.exports = {
    verifyToken,
}