const { Router } = require('express');
const { checkEligibilityController } = require('../controllers/eligibilityController');

const router = Router();

router.post('/check', checkEligibilityController);
router.post('/check/:driveId/:studentId', checkEligibilityController);
router.get('/check/:driveId/:studentId', checkEligibilityController);

module.exports = router;
