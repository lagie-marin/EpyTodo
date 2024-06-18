const db = require("../config/db");
const { error } = require("../utils/Logger");

module.exports = (req, res, next) => {
    var id = req.params.id;

    if (id) {
        db.execute("SELECT * FROM todo WHERE id=?", [id], (err, result) => {
            if (err)
                error(err);
            else if (result == undefined || result.length == 0)
                res.status(404).json({"msg": "Bad parameter"});
            else
                next();
        })
    }
    else
        res.status(500).json({"msg": "Internal server error"});
}