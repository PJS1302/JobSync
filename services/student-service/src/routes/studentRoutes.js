const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticate } = require('../middleware/authMiddleware');

// Public auth endpoints
router.post('/register', (req, res, next) => studentController.register(req, res, next));
router.post('/login', (req, res, next) => studentController.login(req, res, next));

// Authenticated student endpoints
router.get('/me', authenticate, (req, res, next) => studentController.getMe(req, res, next));
router.put('/me', authenticate, (req, res, next) => studentController.updateMe(req, res, next));

// Placement service / Admin inter-service endpoints
router.get('/', (req, res, next) => studentController.getAllStudents(req, res, next));
router.get('/:id', (req, res, next) => studentController.getStudentById(req, res, next));
router.post('/:id/offers', (req, res, next) => studentController.addPlacementOffer(req, res, next));

module.exports = router;
