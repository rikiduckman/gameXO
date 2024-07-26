const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

router.post('/newGame', gameController.createNewGame);
router.post('/move', gameController.makeMove);
router.post('/saveResult', gameController.saveGameResult);
router.get('/replay/:gameId', gameController.replayGame);
router.get('/gameList', gameController.getGameList);

module.exports = router;
