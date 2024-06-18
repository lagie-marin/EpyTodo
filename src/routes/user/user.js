const auth = require("../../middleware/auth");
const { validUserArgs } = require("../../utils/valid_args");
const { getUser, getTodos, getInfoUser, rmUserById, updateUserInfo } = require("./user.query");

module.exports = function(app, bcrypt) {
    app.get("/user", auth, (req, res) => {
        getUser(res, req);
    });

    app.get("/user/todos", auth, (req, res) => {
        getTodos(res, req.user);
    });

    app.get("/users/:identifiant", auth, (req, res) => {
        getInfoUser(res, req.params.identifiant);
    });

    app.delete("/users/:id", auth, (req, res) => {
        rmUserById(res, req.params.id)
    });

    app.put("/users/:id", auth, (req, res) => {
        var id = req.params.id;
        var mail = req.body["email"];
        var name = req.body["name"];
        var fn = req.body["firstname"];
        var mdp = req.body["password"];

        if (validUserArgs(res, mail, name, fn, mdp)) {
            mdp = bcrypt.hashSync(mdp, 10);
            updateUserInfo(res, id, mail, mdp, name, fn);
        }
    });
}
