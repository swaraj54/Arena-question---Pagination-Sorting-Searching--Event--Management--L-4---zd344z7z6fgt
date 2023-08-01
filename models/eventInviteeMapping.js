const mongoose = require('mongoose');

const eventInviteeSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  creator: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  invitee: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

const Invitee = mongoose.model('Invitee', eventInviteeSchema);

module.exports = Invitee;
