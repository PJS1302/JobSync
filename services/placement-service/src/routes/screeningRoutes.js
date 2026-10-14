const { Router } = require('express');
const {
  createScreening,
  getScreeningsByDrive,
  updateScreening,
  getScreeningById,
} = require('../controllers/screeningController');

const router = Router();

router.post('/', createScreening);
router.get('/drive/:driveId', getScreeningsByDrive);
router.put('/:id', updateScreening);
router.get('/:id', getScreeningById);

module.exports = router;
