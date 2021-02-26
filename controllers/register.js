const fs = require('fs');
const Logo = fs.readFileSync('assets/logo.png');


const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    const reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,7})+$/;
    if(!email || !name || password.length <= 6){
        return res.status(400).json('unable to register');
    }
    if( !reg.test(email) ){
        return res.status(400).json('Unvalid email !');
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
                profileimage: Logo,
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