const handleSignin = async (req, res, db, bcrypt) => {
    const { email, password } = req.body;
    const error = await handleSigninErrors(email, password, db);
    if(!error.success){
        return res.status(400).json(error);
    }
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
            res.status(400).json({trigger: 'password', msg: 'Wrong password !!'});
        }
    } catch (err) {
        res.status(400).json({msg: 'Wrong credentials'});
    }
}

const handleSigninErrors = async (email, password, db) => {
    if(!email || !password){
        return {success: false, msg: 'Empty field'};  
    }
    try {
        const [ emailValid ] = await db('login').select(1).where({ email });
        if(!emailValid){
            return {success: false, msg: "Email doesn't exist"};
        } else {
            return {success: true};
        }
    } catch (error) {
        return {success: false, msg: "Error while fetching database!"};
    }
}
module.exports =handleSignin;
