const db = require("../../config/db");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { error, logs } = require("../../utils/Logger");

dotenv.config();

module.exports = { getUser, getTodos, register, checkAccountName, checkAccountMail, getAccountMail, getInfoUser, rmUserById, updateUserInfo };

function getUser(res, req)
{
    db.query(`SELECT * FROM user WHERE id=${req.iduser}`, (err, result) => {
        if (result != undefined && result.length > 0)
            res.status(200).json(result[0]);
        else
            res.status(404).json({"msg":"Internal server error"});
    });
}

function getTodos(res, id)
{
    db.query("SELECT * FROM todo WHERE user_id = ?", [id], (err, result) => {
        if (result != undefined && result.length > 0)
            res.status(200).json(result);
        else
            res.status(404).json({"msg":"Internal server error"});
    });
}

function register(res, mail, mdp, name, fn)
{
    db.execute("INSERT INTO user (email, password, name, firstname) VALUES (?,?,?,?)", [mail, mdp, name, fn], (err, result) => {
        if (err) {
            error(err);
            res.status(500).json({"msg": "Internal server error"});
            return;
        }
        res.status(201).json({token: jwt.sign({id: result.insertId}, process.env.SECRET)});
    });
}

function checkAccountName(res, name, callback)
{
    db.execute("SELECT * FROM user WHERE name = ?", [name], (err, result) => {
        if (result == undefined || result.length == 0)
            callback(0);
        else
            callback(84);
    });
}

function checkAccountMail(res, mail, callback)
{
    db.execute("SELECT * FROM user WHERE email = ?", [mail], (err, result) => {
        if (result == undefined || result.length == 0)
            callback(0);
        else
            callback(84);
    });
}

function getAccountMail(res, mail, mdp, bcrypt, callback)
{
    db.execute("SELECT password, id FROM user WHERE email = ?", [mail], (err, result) => {
        if (result == undefined || result.length == 0)
            callback(84);
        else {
            var mdp2 = result[0].password;

            if(bcrypt.compareSync(mdp, mdp2)) {
                const token = jwt.sign({id:result[0].id}, process.env.SECRET);
                res.json({token});
                callback(0);
            }
            else callback(84);
        }
    });
}

function getInfoUser(res, identifiant)
{
    if (identifiant == undefined || identifiant.length == 0 || identifiant == ":email" || identifiant == ":id")
        res.status(500).json({"msg":"Internal server error"});
    else
        db.execute(`SELECT * FROM user WHERE id=? OR email=?`, [identifiant, identifiant], (err, result) => {
            if (err) {
                error(err);
                res.status(500).json({"msg":"Internal server error"});
            }
            if (result != undefined && result.length > 0)
                res.status(200).json(result);
            else
                res.status(404).json({"msg":"Internal server error"});
        });
}

function rmUserById(res, id)
{
    db.execute(`SELECT * FROM user WHERE id=${id}`, (err, result) => {
        if (result != undefined && result.length > 0) {
            db.execute(`DELETE FROM user WHERE id=${id}`, (err, result) => {
                if (err) {
                    error(err);
                    res.status(500).json({"msg":"Internal server error"});
                } else {
                    res.status(200).json({"msg" : `Successfully deleted record number: ${id}`});
                }
            });
        }
        else
            res.status(404).json({"msg":"Internal server error"});
    })
}

function updateUserInfo(res, id, mail, mdp, name, fn)
{
    db.execute(`SELECT * FROM user WHERE id=${id}`, (err, result) => {
        if (result != undefined && result.length > 0)
            db.execute(`UPDATE user SET email=?, password=?, name=?, firstname=? WHERE id=${id}`, [mail, mdp, name, fn], (err, result) => {
                if (err)
                    error(err);
                db.execute(`SELECT id, email, password, created_at, firstname, name FROM user WHERE id=${id}`, (err, result) => {
                    if (result != undefined && result.length > 0)
                        res.status(200).json(result);
                    else
                        res.status(404).json({"msg":"Internal server error"});
                });
            });
        else
            res.status(404).json({"msg":"Internal server error"});
    });
}