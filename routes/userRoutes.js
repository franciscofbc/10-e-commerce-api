const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');

const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require('../controllers/userController');

router
  .route('/')
  .get(authenticateUser, authorizePermissions('admin', 'user'), getAllUsers);
router.route('/showMe').get(authenticateUser, showCurrentUser);
router.route('/updateUser').patch(updateUser);
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword);
//always the last one
router
  .route('/:id')
  .get(authenticateUser, authorizePermissions('admin', 'owner'), getSingleUser);

module.exports = router;
