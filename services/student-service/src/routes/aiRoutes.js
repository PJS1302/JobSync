const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/match', aiController.matchJob);
router.post('/analyze', aiController.matchJob);
router.post('/extract-skills', aiController.extractSkills);

module.exports = router;
