const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authenticate } = require('../middleware/authMiddleware');

// Student application actions
router.post('/', authenticate, (req, res, next) => applicationController.apply(req, res, next));
router.get('/my-applications', authenticate, (req, res, next) => applicationController.getMyApplications(req, res, next));

// Inter-service and drive applicant queries
router.get('/drive/:driveId', (req, res, next) => applicationController.getApplicationsByDrive(req, res, next));
router.patch('/:id/status', (req, res, next) => applicationController.updateStatus(req, res, next));
router.get('/:id', authenticate, (req, res, next) => applicationController.getApplicationById(req, res, next));

module.exports = router;
