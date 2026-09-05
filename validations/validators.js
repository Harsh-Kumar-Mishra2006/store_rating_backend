const { body } = require('express-validator');

const userValidations = {
  register: [
    body('name')
      .trim()
      .isLength({ min: 20, max: 60 })
      .withMessage('Name must be between 20 and 60 characters'),
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 8, max: 16 })
      .withMessage('Password must be between 8 and 16 characters')
      .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
      .withMessage('Password must contain at least one uppercase letter and one special character'),
    body('address')
      .trim()
      .isLength({ max: 400 })
      .withMessage('Address must not exceed 400 characters')
  ],
  createUser: [
    body('name')
      .trim()
      .isLength({ min: 20, max: 60 })
      .withMessage('Name must be between 20 and 60 characters'),
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 8, max: 16 })
      .withMessage('Password must be between 8 and 16 characters')
      .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
      .withMessage('Password must contain at least one uppercase letter and one special character'),
    body('address')
      .trim()
      .isLength({ max: 400 })
      .withMessage('Address must not exceed 400 characters')
  ],
  login: [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  updatePassword: [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8, max: 16 })
      .withMessage('Password must be between 8 and 16 characters')
      .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
      .withMessage('Password must contain at least one uppercase letter and one special character')
  ]
};

const storeValidations = {
  create: [
    body('name').trim().notEmpty().withMessage('Store name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('address').trim().notEmpty().withMessage('Address is required')
  ],
  update: [
    body('name').optional().trim().notEmpty(),
    body('email').optional().isEmail(),
    body('address').optional().trim().notEmpty()
  ]
};

const ratingValidations = {
  submit: [
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5')
  ]
};

module.exports = {
  userValidations,
  storeValidations,
  ratingValidations
};