const changeProfilePic = (req, res, next, db) => {
    if(req.file.mimetype === 'image/jpeg'){
        db('users')
        .update({
            profileimage: req.file.buffer
        })
        .then(() => res.status(200).json('DONE!'))
        .catch(err => console.log(err))
    } else {
        return res.status(400).json('file format not supported: only .jpg allowed')
    }

}

module.exports = {
    changeProfilePic
}