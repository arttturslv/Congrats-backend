const express = require('express')
const router = express.Router();

const cardController = require('../controllers/CardController');

router.post('/create', cardController.create);

router.get('/stats', cardController.getCardsCount);

router.get('/:id/:passKey?', cardController.getCard);

router.post('/update/:id', cardController.updateShareCount);

module.exports = router;