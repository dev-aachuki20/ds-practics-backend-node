const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const postController = require('../controllers/admin/postController');
const upload = require('../utils/multerConfig');

router.use(requireAuth);
router.use(requireAdmin);

router.post('/', upload, postController.createPost);
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.put('/:id', upload, postController.updatePost);
router.delete('/:id', postController.deletePost);

module.exports = router;