const handleSignin = async (req, res, db, bcrypt) => {
    const { email, password } = req.body;
    if(!email || !password) return res.status(400).json({msg: 'Empty field'});
    
    try {
        const data = await db('login').select('id','password').where({ email });
        const isValid = bcrypt.compareSync(password, data[0].password);
        if(isValid){
            const [user] = await db('user').
            join("login", "user.id", '=',"login.id")
            .select('user.id','name', 'email', 'avatar', 'entries', 'joined')
            .where('user.id', '=', data[0].id);

            res.json({user});
        } else {
            res.status(400).json({msg: 'Wrong password !!'});
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({msg: 'Wrong credentials'});
    }
}
module.exports =handleSignin;
