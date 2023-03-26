const express = require('express');
const router = express.Router();

const {createGame, assignPlayer} = require('../controllers/game.js');

router.route('/').post(createGame);
router.route('/:id').patch(assignPlayer);

module.exports = router;