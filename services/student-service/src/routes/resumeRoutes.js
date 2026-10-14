const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const { uploadResume } = require('../middleware/uploadMiddleware');

router.post('/upload', uploadResume, resumeController.uploadResume);
router.get('/:studentId', resumeController.getResumeByStudentId);

module.exports = router;
