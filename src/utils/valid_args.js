const { validate } = require("email-validator");

module.exports = {validUserArgs, validTodoArgs};

function validUserArgs(res, mail, name, fn, mdp)
{
    let return_value = 0;

    if (mail == undefined || name == undefined || fn == undefined || mdp == undefined)
        res.status(400).json({"msg":"there is information missing"});
    else if (mail.length === 0 || name.length === 0 || fn.length === 0)
        res.status(400).json({"msg": "email, name and firstname is required"});
    else if (!validate(mail))
        res.status(400).json({"msg": "Email is not valid"});
    else if (name == fn)
        res.status(400).json({"msg": "Name and surname must be different"});
    else if (name == mdp || fn == mdp || mail == mdp)
        res.status(400).json({"msg": "The password must be different from the name, first name and email"});
    else if (mdp.length < 8)
        res.status(400).json({"msg": "Password must contain at least 8 characters"});
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W])[A-Za-z\d\W]{8,}$/.test(mdp))
        res.status(400).json({"msg": "Password must contain lower case, upper case, number and special characters"});
    else
        return_value = 1;
    return return_value;
}

function validTodoArgs(res, title, desc, due, id, status)
{
    let return_value = 0;
    if (title == undefined || desc == undefined || due == undefined
        || id == undefined || status == undefined) {
            res.status(500).json({"msg":"Internal server error"});
    }
    else
        return_value = 1;
    return return_value;
}