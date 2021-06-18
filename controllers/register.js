const handleRegister = async (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;

    const error = await handleRegisterErrors(name, email, password, db);
    if(!error.success){
        return res.status(400).json(error);
    }
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({name, joined: new Date()})
        .into('user')
        .returning('id')
        .then(id => {
            trx.insert({id: id[0], email, password: hash})
            .into("login")
            .then(resp => {
                return trx('user')
                .join("login", "user.id", "login.id")
                .select('user.id', 'name', 'email', 'avatar', 'entries', 'joined').where({name})
                .then(user => res.json({user: user[0]}))
                .catch(err => res.status(400).json({msg: "Unable to register"}));
            })
            .then(trx.commit)
            .catch(trx.rollback);
        })
        .catch(err => {
            res.status(400).json({msg: 'Unable to register'})
        });
    });
}

const handleRegisterErrors = async (name, email, password, db) => {
    const reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,7})+$/;
    if (!email || !name || !password) {
        return {success: false, msg: 'Empty field !'};
    } else if (password.length <= 6) {
        return {success: false, msg: 'Unvalid password: must contain at least 6 characters.'};
    } else if ( !reg.test(email) ) {
        return {success: false, msg: 'Unvalid email !'};
    }

    try {
        const [ nameExists ] = await db('user').select(1).where({ name });
        if(nameExists){
            return {success: false, msg: "Name Already exits ."};
        } else {
            const [ emailExists ] = await db('login').select(1).where({ email });
            if(emailExists){
                return {success: false, msg: "Email Already exits ."};
            } else {
                return {success: true};
            }
        }
    } catch (err) {
        return {success: false, msg: "Error while fetching database!"};
    }
}

module.exports = handleRegister;