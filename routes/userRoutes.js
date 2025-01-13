const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { usersList } = require('../controllers/admin/userController');

router.get('/', requireAuth, requireAdmin, usersList);


module.exports = router;