const jwt = require('jsonwebtoken');
const User = require("../modals/User");
const auth = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    console.log(token);
    try{
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        console.log("decoded",decoded);
        const user = await User.findOne({ _id: decoded._id, "tokens.token": token });
        if (!user) {
            throw new Error();
        }
        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        console.log(e);
        res.status(401).send(" Authentication Error"+e.message);
    }
}
module.exports = auth;
