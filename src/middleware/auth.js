const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const headersauth = req.headers['authorization'];

    if (headersauth == undefined || headersauth.length == 0)
        return res.status(401).json({"msg":"No token, authorization denied"});
    const token = headersauth.replace("Bearer ", "");
    jwt.verify(token, process.env.SECRET, (err, result) => {
        if (err)
            return res.status(401).json({"msg":"Token is not valid"});
        req.iduser = result["id"];
        next();
    });
}
