const express = require('express')
const router = express.Router();

const cardController = require('../controllers/CardController');

router.post('/create', cardController.create);

router.get('/view/:id', cardController.getCard);

router.get('/stats/count', cardController.getCardsCount);

module.exports = router;