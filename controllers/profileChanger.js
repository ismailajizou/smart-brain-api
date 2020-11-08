const changeProfilePic = (req, res, db) => {
    if(req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png'){
        db('users')
        .update({ profileimage: req.file.buffer })
        .returning('profileimage')
        .then(resp =>  res.json(resp))
        .catch(err => console.log(err))
    } else {
        return res.status(400).json('file format not supported: only .jpg and .png allowed')
    }

}

module.exports = {
    changeProfilePic
}