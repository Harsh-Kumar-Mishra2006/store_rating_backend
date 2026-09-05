const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { authMiddleware, checkRole } = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const { storeValidations } = require('../validations/validators');

router.get('/', storeController.getStores);
router.get('/:id', storeController.getStoreById);

router.use(authMiddleware);

router.get('/owners/list', checkRole('super_admin', 'admin'), storeController.getStoreOwners);
router.post('/', checkRole('super_admin', 'admin'), validate(storeValidations.create), storeController.createStore);
router.put('/:id', checkRole('super_admin', 'admin'), validate(storeValidations.update), storeController.updateStore);
router.delete('/:id', checkRole('super_admin', 'admin'), storeController.deleteStore);

router.get('/owner/dashboard', checkRole('store_owner'), storeController.getStoreOwnerDashboard);

module.exports = router;