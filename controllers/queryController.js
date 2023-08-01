const Event = require('../models/eventmodel');

const queryEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10, name, sort = 'date' } = req.query;

    const query = {};
    if (name) {
      query.name = { $regex: name, $options: 'i' }
    }
    const sortPrefix = sort[0] == '-' ? "-" : "";
    const sortField = sort.replace(/^-/, "");
    const sortOption = { [sortField]: `${sortPrefix}1` }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitValue = parseInt(limit);

    const events = await Event.find(query).sort(sortOption).skip(skip).limit(limitValue).lean();

    return res.status(200).json(events)


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { queryEvents };
