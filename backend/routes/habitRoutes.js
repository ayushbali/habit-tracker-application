import express from 'express';
import {createHabit, getHabits, updateHabit, deleteHabit} from '../controllers/habitController.js';

const router = express.Router();

router.post('/create-habit', createHabit)
router.get('/habits', getHabits)
router.put('/habits/:id', updateHabit)
router.delete('/habits/:id', deleteHabit);

export default router