const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router
  .route('/')
  .post(studentController.createStudent)
  .get(studentController.getAllStudents);

// Named routes must precede /:id parameter matching
router
  .route('/profile')
  .get(studentController.getProfile)
  .put(studentController.updateProfile);

router
  .route('/dashboard')
  .get(studentController.getDashboard);

router
  .route('/:id')
  .get(studentController.getStudentById)
  .put(studentController.updateStudent)
  .delete(studentController.deleteStudent);

module.exports = router;
