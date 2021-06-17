const deleteAccount = async (req, res, db, bcrypt) => {
    const { id } = req.params;
    const { password } = req.body;
    if(!password) return res.status(400).json({success: false, msg: "No password is entred !"});

    try {
        const [data] = await db('user')
        .join('login', 'user.id','login.id')
        .select('password').where('user.id', id);
        const isValid = bcrypt.compareSync(password, data.password);
        if(isValid){
            const _ = await db('user').where({ id }).del();
            res.json({success: true, msg: 'Deleted successfully'})
        } else {
            res.status(400).json({success: false, msg: "Wrong password !"});
        }
    } catch (err) {
        res.status(400).json({success: false, msg: "Error while deleting account !"});
    }
}

module.exports = deleteAccount;