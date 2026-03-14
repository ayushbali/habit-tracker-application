import express from 'express';
import {createLog , getLogs, updateLog } from '../controllers/logController.js';

const router = express.Router();

router.post('/logs', createLog)
router.get('/logs', getLogs)
router.put('/logs/:id', updateLog)
export default router;
