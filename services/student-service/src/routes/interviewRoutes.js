const express = require('express');
const {
  createInterview,
  getInterviewsByStudent,
  getInterviewById,
} = require('../controllers/interviewController');

const router = express.Router();

// POST   /api/interviews            – create an interview record
router.post('/', createInterview);

// GET    /api/interviews/student/:studentId  – interviews for a student
router.get('/student/:studentId', getInterviewsByStudent);

// GET    /api/interviews/:id        – single interview by ID
router.get('/:id', getInterviewById);

module.exports = router;
