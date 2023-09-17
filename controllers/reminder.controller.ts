// controllers/reminderController.ts

import { Request, Response } from "express";
import { Reminder } from "../models/reminder";
import notificationService from "../services/notification.service";

export const getAllReminders = async (req: Request, res: Response) => {
  try {
    const reminders = await Reminder.findAll();
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving reminders", error });
  }
};

export const getReminderById = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const reminder = await Reminder.findByPk(id);
    if (reminder) {
      res.json(reminder);
    } else {
      res.status(404).json({ message: "Reminder not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving reminder", error });
  }
};

export const createReminder = async (req: Request, res: Response) => {
  try {
    const reminder = await Reminder.create(req.body);
    const { tokenDevice } = req.body;
    const { title, description, date, personEmail } = reminder;
    const data = { title, description, date, tokenDevice, personEmail }; //constructing the variable that will be used for creating the notification
    const notification = await notificationService.createNotification(data);
    if (notification) {
        res.status(201).json({reminder, msg:"Recordatorio creado exitosamente"});
    }
  } catch (error) {
    res.status(500).json({ message: "Error creating reminder", error });
  }
};

export const updateReminder = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const [updated] = await Reminder.update(req.body, {
      where: { id: id },
    });
    if (updated) {
      const updatedReminder = await Reminder.findByPk(id);
      res.json(updatedReminder);
    } else {
      res.status(404).json({ message: "Reminder not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating reminder", error });
  }
};

export const deleteReminder = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const deleted = await Reminder.destroy({
      where: { id: id },
    });
    if (deleted) {
      res.status(204).json({ message: "Reminder deleted" });
    } else {
      res.status(404).json({ message: "Reminder not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting reminder", error });
  }
};
