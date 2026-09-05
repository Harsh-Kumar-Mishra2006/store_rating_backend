const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, checkRole } = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const { userValidations } = require('../validations/validators');

router.use(authMiddleware);

router.put('/password', validate(userValidations.updatePassword), userController.updatePassword);

router.get('/me', userController.getCurrentUser);

router.get('/dashboard', checkRole('super_admin', 'admin'), userController.getDashboardStats);

router.get('/', checkRole('super_admin', 'admin'), userController.getUsers);

router.post('/', checkRole('super_admin', 'admin'), validate(userValidations.createUser), userController.createUser);

router.put('/:id', checkRole('super_admin', 'admin'), userController.updateUser);

router.delete('/:id', checkRole('super_admin', 'admin'), userController.deleteUser);

router.get('/:id', userController.getUserById);

module.exports = router;