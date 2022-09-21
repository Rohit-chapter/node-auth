const { decode } = require("../common/password");
const userModel = require("../models/user");

/**
 * user validate the token
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.userValidateToken = async (req, res, next) => {
    try {
        let cookies = {};
        req.headers &&
            req.headers.cookie.split(";").forEach(function (cookie) {
                let parts = cookie.match(/(.*?)=(.*)$/);
                cookies[parts[1].trim()] = (parts[2] || "").trim();
            });

        const { id } = await decode(cookies.jwtCookies);

        const userDetails = await userModel.findById(id);

        if (userDetails) {
            req.userId = userDetails._id;
            next();
        } else {
            return res.status(500).json({
                errors: "error",
            });
        }
    } catch (error) {
        console.log("erro", error)
        return res.status(500).json({
            errors: "error...",
        });
    }
};
