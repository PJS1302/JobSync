const express = require('express');
const {
  createPlacement,
  getPlacementsByStudent,
  getPlacementById,
} = require('../controllers/placementController');

const router = express.Router();

// POST   /api/placements            – record a placement result
router.post('/', createPlacement);

// GET    /api/placements/student/:studentId  – placements for a student
router.get('/student/:studentId', getPlacementsByStudent);

// GET    /api/placements/:id        – single placement record by ID
router.get('/:id', getPlacementById);

module.exports = router;
