const db = require("../../config/db");
const { error } = require("../../utils/Logger");

module.exports = { getTodos, getTodosById, createTodos, deleteTodosById, updateTodosById };

function getTodos(res)
{
    db.query("SELECT * FROM todo", (err, result) => {
        if (result != undefined && result.length > 0)
            res.status(200).json(result);
        else
            res.status(404).json({"msg":"Internal server error"});
    });
}

function getTodosById(res, id)
{
    db.execute(`SELECT * FROM todo WHERE id=${id}`, (err, result) => {
        if (result != undefined && result.length > 0)
            res.status(200).json(result);
        else
            res.status(404).json({"msg":"Internal server error"});
    });
}

function createTodos(res, title, desc, due, id, status)
{
    db.execute(`SELECT * FROM todo WHERE id=${id}`, (err, result) => {
        if (err)
            error(err);
        else if (result == undefined || result.length == 0)
            res.status(404).json({"msg":"Internal server error"});
        else
            db.execute("INSERT INTO todo (title,description,due_time,user_id,status) VALUES (?,?,?,?,?)", [title, desc, due, id, status], (err, result) => {
                if (err) {
                    error(err);
                    res.status(500).json({"msg":"Internal server error"});
                }
                else
                    db.execute('SELECT * FROM `todo` WHERE id = ?', [result.insertId], function(err, results, ) {
                        if (err) {
                            error(err);
                            res.status(500).json({"msg":"Internal server error"});
                        }
                        else
                            res.status(201).json(result);
                    });
            });
    });
}

function deleteTodosById(res, id)
{
    db.execute(`SELECT * FROM todo WHERE id=${id}`, (err, result) => {
        if (result == undefined || result.length == 0)
            res.status(404).json({"msg":"Internal server error"});
        else
            db.execute("DELETE FROM todo WHERE id=?", [id], (err, result) => {
                res.status(200).json({"msg": `Successfully deleted record number: ${id}`});
            });
    });
}

function updateTodosById(res, title, desc, due, user_id, status, id)
{
    db.execute(`SELECT * FROM todo WHERE id=${id}`, (err, result) => {
        if (result == undefined || result.length == 0)
            res.status(404).json({"msg": "Internal server error"});
        else
            db.execute("UPDATE todo SET title=?, description=?, due_time=?, user_id=?, status=? WHERE id=?", [title, desc, due, user_id, status, id], (err, result) => {
                if (err) {
                    error(err);
                    res.status(500).json({"msg":"Internal server error"});
                }
                else if (result == undefined || result.length == 0)
                    res.status(404).json({"msg": "Internal server error"});
                else
                    db.execute(`SELECT id, title, description, created_at, due_time, user_id, status FROM todo WHERE id=${id}`, function(err, results) {
                        if (err) {
                            error(err);
                            res.status(500).json({"msg":"Internal server error"});
                        }
                        if (result == undefined || result.length == 0)
                            res.status(404).json({"msg": "Internal server error"});
                        else {
                            res.status(200).json(result);
                        }
                    });
            });
    })
}