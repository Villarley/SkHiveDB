// routes/reminderRouter.ts

import express from 'express';
import {
    getAllReminders,
    getReminderById,
    createReminder,
    updateReminder,
    deleteReminder
} from '../controllers/reminder.controller';

const router = express.Router();

router.get('/', getAllReminders);
router.get('/:id', getReminderById);
router.post('/', createReminder);
router.put('/:id', updateReminder);
router.delete('/:id', deleteReminder);

export default router;
