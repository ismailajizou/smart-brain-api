const handleProfile = async (req,res, db) => {
    const { id } = req.params;
    try {
        const user = await db.select('*').from('user').where({id});
        if (user.length) {
            res.json({user: user[0]});
        } else {
            res.status(404).json({msg: "not found"});
        }
    } catch (err) {
        res.status(400).json({msg: 'error getting user'});
    }
}
module.exports =  handleProfile;