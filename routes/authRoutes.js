const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middleware/validationMiddleware');
const { userValidations } = require('../validations/validators');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/register', validate(userValidations.register), authController.register);
router.post('/login', validate(userValidations.login), authController.login);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;