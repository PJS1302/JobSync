const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');

router.post('/', applicationController.createApplication);
router.get('/student/:studentId', applicationController.getApplicationsByStudent);
router.get('/:id', applicationController.getApplicationById);
router.put('/:id/status', applicationController.updateApplicationStatus);

module.exports = router;
