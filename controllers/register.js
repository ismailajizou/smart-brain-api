const fs = require('fs');
const image = fs.readFileSync('assets/logo.jpg');

const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    if(!email || !name || !password){
        return res.status(400).json('unable to register');
    }
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({hash,email}).into('login').returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0],
                name,
                profileimage: image,
                joined: new Date()
            })
            .then(user => {
                res.json(user[0])
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
     .catch(err => res.status(400).json('Unable to register'))
}

module.exports = {
    handleRegister
}