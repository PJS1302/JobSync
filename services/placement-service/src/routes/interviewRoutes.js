const { Router } = require('express');
const {
  createInterviewRound,
  getInterviewsByDrive,
  updateInterviewRound,
  getInterviewById,
  recordSelection,
} = require('../controllers/interviewController');

const router = Router();

router.post('/select', recordSelection);
router.post('/', createInterviewRound);
router.get('/drive/:driveId', getInterviewsByDrive);
router.put('/:id', updateInterviewRound);
router.get('/:id', getInterviewById);

module.exports = router;
