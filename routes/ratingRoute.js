const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { authMiddleware } = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const { ratingValidations } = require('../validations/validators');

router.use(authMiddleware);

router.post('/stores/:storeId/ratings', validate(ratingValidations.submit), ratingController.submitRating);
router.get('/stores/:storeId/ratings', ratingController.getUserRating);

module.exports = router;