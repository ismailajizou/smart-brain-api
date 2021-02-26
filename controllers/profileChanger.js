const sharp = require('sharp');

const changeProfilePic = (req, res, db) => {
    if((req.file.mimetype === 'image/jpeg' 
    || req.file.mimetype === 'image/png')
    && req.file.size <= 100000){
        sharp(req.file.buffer).resize({
            width: 100,
            height: 100,
            position: 'center',
        }).toBuffer().then(buffer => 
            db('users')
            .update({ profileimage: buffer })
            .returning('profileimage')
            .then(response =>  res.json(response))
            .catch(err => res.json("Ooops! something went wrong!"))
        )
    } else {
        return res.status(400).json('file format not supported: only .jpg and .png allowed')
    }
}

module.exports = {
    changeProfilePic
}