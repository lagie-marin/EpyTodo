const { checkAccountMail, getAccountMail, register } = require('../user/user.query');
const { validUserArgs } = require('../../utils/valid_args');

module.exports = function (app, bcrypt) {
    app.post("/login", (req, res) => {
        var mail = req.body["email"];
        var mdp = req.body["password"];

        if (mail == undefined || mdp == undefined) {
            res.status(500).json({"msg":"internal server error"});
            return;
        }
        getAccountMail(res, mail, mdp, bcrypt, (nb) => {
            if (nb == 84)
                res.status(404).json({"msg" : "Invalid Credentials"});
        });
    });

    app.post("/register", (req, res) => {
        var mail = req.body["email"];
        var name = req.body["name"];
        var fn = req.body["firstname"];
        var mdp = req.body["password"];

        if (validUserArgs(res, mail, name, fn, mdp)) {
            mdp = bcrypt.hashSync(mdp, 10);
            checkAccountMail(res, mail, nb => {
                if (nb == 84)
                    res.status(409).json({ "msg": "Account already exists" });
                else
                    register(res, mail, mdp, name, fn);
            });
        }
    });
}