const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const { authenticate } = require('../middleware/authMiddleware');
const { uploadResume } = require('../middleware/uploadMiddleware');

// Upload resume
router.post('/upload', authenticate, uploadResume.single('resume'), (req, res, next) =>
  resumeController.upload(req, res, next)
);

// Student resume management
router.get('/my-resumes', authenticate, (req, res, next) =>
  resumeController.getMyResumes(req, res, next)
);
router.get('/active', authenticate, (req, res, next) =>
  resumeController.getActiveResume(req, res, next)
);
router.patch('/:id/default', authenticate, (req, res, next) =>
  resumeController.setDefault(req, res, next)
);
router.delete('/:id', authenticate, (req, res, next) =>
  resumeController.delete(req, res, next)
);

// Download and view
router.get('/:id/download', (req, res, next) =>
  resumeController.download(req, res, next)
);
router.get('/:id', authenticate, (req, res, next) =>
  resumeController.getResumeById(req, res, next)
);

module.exports = router;
