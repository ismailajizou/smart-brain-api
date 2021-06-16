const Clarifai = require('clarifai');
const app = new Clarifai.App({ apiKey: 'ecee88708b03449e9d7664f7987c6f2c' });

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json({msg: 'Something went wrong when fetching API'}));
}

  const handleImage = async (req, res, db) => {
    const { id } = req.body;
    try {
      const resp = await db('user').where({id}).increment('entries', 1);
      if (resp) {
        const [{entries}] = await db('user').select("entries").where({id});
        res.json({entries});
      } else {
        res.status(400).json({msg: "Unable to modify entries"});
      }
    } catch (error) {
      res.status(400).json({msg: "Unable to get entries"});
    }
}
module.exports = {
    handleImage,
    handleApiCall
}