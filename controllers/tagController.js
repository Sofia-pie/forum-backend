const { Tag } = require('../models/Tag');

const createTag = async (req, res) => {
  const { name } = req.body;

  try {
    let tag = await Tag.findOne({ name });

    if (!tag) {
      tag = new Tag({ name });
      await tag.save();
    }

    res.status(201).json(tag);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTags = (req, res) => {
  Tag.find()
    .then((tags) => {
      res.status(200).json(tags);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

module.exports = {
  getTags,
};
