const { Router } = require('express');
const {
  createDrive,
  getAllDrives,
  getDriveById,
  updateDrive,
  deleteDrive,
} = require('../controllers/driveController');

const router = Router();

router.post('/', createDrive);
router.get('/', getAllDrives);
router.get('/:id', getDriveById);
router.put('/:id', updateDrive);
router.delete('/:id', deleteDrive);

module.exports = router;
