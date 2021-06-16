const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    const reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,7})+$/;
    if(!email || !name) return res.status(400).json({msg: 'Empty field !'});
    if(password.length <= 6) return res.status(400).json({msg: 'Unvalid password: must contain at least 6 characters.'});
    if( !reg.test(email) ) return res.status(400).json({msg: 'Unvalid email !'});

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

module.exports = handleRegister;