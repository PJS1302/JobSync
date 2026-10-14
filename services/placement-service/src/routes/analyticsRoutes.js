const { Router } = require('express');
const {
  getOverview,
  getCompanyAnalytics,
  getDepartmentAnalytics,
} = require('../controllers/analyticsController');

const router = Router();

router.get('/overview', getOverview);
router.get('/companies', getCompanyAnalytics);
router.get('/departments', getDepartmentAnalytics);

module.exports = router;
