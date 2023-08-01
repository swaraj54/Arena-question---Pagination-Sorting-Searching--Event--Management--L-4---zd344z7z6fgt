const express = require('express');
const router = express.Router();
const Event = require('../models/eventmodel');
const User = require('../models/usermodel');
const Invitee = require('../models/eventInviteeMapping');
const jwt = require('jsonwebtoken');

//Creating a new Event
const createEvent = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { name, date } = req.body;
    const event = new Event({
      name,
      creator: decoded._id,
      date,
    });
    await event.save();
    res.send('Event created successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Inviting Users to a Event
const inviteUser = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { eventId, invitee } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).send('Event not found');
    }
    if (event.creator != decoded._id) {
      return res.status(401).send('Unauthorized');
    }
    if (!User.findById(invitee)) {
      return res.status(404).send('invitee not found');
    }

    const invitees = new Invitee({
      eventId: event,
      creator: event.creator,
      invitee: invitee,
    });
    await invitees.save();
    res.send('Users invited successfully' + invitees);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { name, date } = req.body;
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).send('Event not found');
    }
    const updateEvent = await Event.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          date,
        },
      },
      { new: true }
    );
    res.send('Event updated successfully');
    console.log(updateEvent);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

module.exports = { createEvent, inviteUser, updateEvent };
