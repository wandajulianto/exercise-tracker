import express from 'express';
import {
  saveUser,
  getUser,
  saveExercise,
  getLogs
} from '../controllers/UserController.js';

const router = express.Router();

router.post('/users', saveUser);
router.get('/users', getUser);
router.post('/users/:_id/exercises', saveExercise);
router.get('/users/:_id/logs', getLogs);

export default router;
