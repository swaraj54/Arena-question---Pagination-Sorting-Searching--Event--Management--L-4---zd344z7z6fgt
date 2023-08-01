const express = require('express');
const router = express.Router();
const {
  createEvent,
  inviteUser,
  updateEvent,
} = require('../controllers/eventControllers');
const { update } = require('../models/eventmodel');
const { queryEvents } = require('../controllers/queryController');

router.post('/event', createEvent);
router.post('/events/:eventId/invite', inviteUser);
router.put('/update/:eventId', updateEvent);
router.get('/query', queryEvents);

module.exports = router;
