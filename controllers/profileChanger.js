const sharp = require('sharp');

const changeProfilePic = (req, res, db) => {
    const image = req.file;
    const { id } = req.params;
    if((image.mimetype === 'image/jpeg' 
    || image.mimetype === 'image/png')
    && image.size <= 1024 * 100){
        sharp(image.buffer).resize({
            width: 100,
            height: 100,
            position: 'center',
        }).toBuffer().then(buffer => 
            db('users')
            .update({ profileimage: buffer })
            .where({id})
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
