const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matches');
const { validate, schemas } = require('../middleware/validation');

// GET /api/matches - Get all matches for authenticated user
router.get('/', matchController.getUserMatches);

// POST /api/matches - Create new match
router.post('/', validate(schemas.match.create), matchController.createMatch);

// PUT /api/matches/:id - Update match
router.put('/:id', validate(schemas.match.update), matchController.updateMatch);

// POST /api/matches/:matchId/players - Add player to match
router.post('/:matchId/players', validate(schemas.matchPlayer.create), matchController.addPlayer);

// DELETE /api/matches/:matchId/players/:userId - Remove player from match
router.delete('/:matchId/players/:userId', matchController.removePlayer);

module.exports = router;