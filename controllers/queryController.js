const Event = require('../models/eventmodel');

const queryEvents = async (req, res) => {
  try {
    //Write a code here for pagination, sorting, searching
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { queryEvents };
