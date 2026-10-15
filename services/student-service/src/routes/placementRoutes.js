const express = require('express');
const {
  createPlacement,
  getAllPlacements,
  getPlacementsByStudent,
  getPlacementById,
} = require('../controllers/placementController');

const router = express.Router();

// GET    /api/placements            – get all placement records
router.get('/', getAllPlacements);

// POST   /api/placements            – record a placement result
router.post('/', createPlacement);

// GET    /api/placements/student/:studentId  – placements for a student
router.get('/student/:studentId', getPlacementsByStudent);

// GET    /api/placements/:id        – single placement record by ID
router.get('/:id', getPlacementById);

module.exports = router;
