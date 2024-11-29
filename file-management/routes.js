const express = require('express');
const { uploadFile, getUserFiles, imageclick } = require('./index');
const { authenticate } = require('../middlewares/auth.middleware.js'); // Middleware for JWT verification
const router = express.Router();

router.post('/upload', authenticate, uploadFile);
router.get('/files', authenticate, getUserFiles);

router.get('/image-click/:fileId', imageclick);

module.exports = router;
