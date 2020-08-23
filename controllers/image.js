const Clarifai = require('clarifai');
const app = new Clarifai.App({
    apiKey: 'ecee88708b03449e9d7664f7987c6f2c'
  });

const handleApiCall = (req, res) => {
      app.models
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => {
            res.json(data);
        })
        .catch(err => res.status(400).json('unable to use the API'))
}

  const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0])
    })
    .catch(err => res.status(400).json('unable to get entries'))
}
module.exports = {
    handleImage,
    handleApiCall
}