const auth = require("../../middleware/auth");
const notFound = require("../../middleware/notFound");
const { validTodoArgs } = require("../../utils/valid_args");
const { getTodos, getTodosById, createTodos, deleteTodosById, updateTodosById } = require("./todos.query")

module.exports = function(app, bcrypt) {
    app.get("/todos", auth, (req, res) => {
        getTodos(res);
    });

    app.get("/todos/:id", auth, notFound, (req, res) => {
        getTodosById(res, req.params.id);
    });

    app.post("/todos", auth, (req, res) => {
        let title = req.body.title;
        let desc = req.body.description;
        let due = req.body.due_time;
        let id = req.body.user_id;
        let status = req.body.status;

        if (validTodoArgs(res, title, desc, due, id, status))
            createTodos(res, title, desc, due, id, status);
    });

    app.delete("/todos/:id", auth, (req, res) => {
        deleteTodosById(res, req.params.id);
    });

    app.put("/todos/:id", auth, (req, res) => {
        let title = req.body.title;
        let desc = req.body.description;
        let due = req.body.due_time;
        let user_id = req.body.user_id;
        let status = req.body.status;
        let id = req.params.id;

        if (validTodoArgs(res, title, desc, due, id, status) || id != undefined)
            updateTodosById(res, title, desc, due, user_id, status, id);
        else
            res.status(500).json({"msg":"Internal server error"});
    });
}