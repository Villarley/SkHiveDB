// routes/reminderRouter.ts

import express from 'express';
import {
    getAllRemindersByUserEmail,
    getReminderById,
    createReminder,
    updateReminder,
    deleteReminder
} from '../controllers/reminder.controller';
import { validateJWT } from '../middlewares/validate-jwt';

const router = express.Router();

router.get('/email/:email',  getAllRemindersByUserEmail);
router.get('/:id',  getReminderById);
router.post('/', createReminder);
router.put('/:id', updateReminder);
router.delete('/:id', deleteReminder);

export default router;
