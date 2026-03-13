import express from 'express';
import {createHabit} from '../controllers/habitController.js';

const router = express.Router();

router.post('/create-habit', createHabit)

export default router