const changeProfilePic = async (req, res, db) => {
    const image  = req.file;
    const { id } = req.params;
    const validImage = (image.mimetype === 'image/jpeg' || image.mimetype === 'image/png') && image.size <= 1024 * 1024;

    if(validImage){
        try{
            const buffer = await require("sharp")(image.buffer).resize({
                width: 100,
                height: 100,
                position: 'center',
            }).png().toBuffer();
            const string = buffer.toString('base64');
            const [avatar] = await db('user').update({avatar: `data:image/png;base64,${string}`}).where({id}).returning("avatar");
            res.json({avatar});
        } catch(err) {
            res.status(400).json({msg: "Unable to change profile"});
        }
    } else {
        res.status(400).json({msg: 'Image NOT Valid'});
    }
}

module.exports = changeProfilePic;
