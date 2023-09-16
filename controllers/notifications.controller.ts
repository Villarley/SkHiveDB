import { Request, Response } from 'express';
import {Notification} from '../models/notification';
import fcmService from '../services/fcmService';

export const getNotifications = async (req: Request, res: Response) => {
    try {
        const notifications = await Notification.findAll();
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las notificaciones', error });
    }
};

export const createNotification = async (req: Request, res: Response) => {
    try {
        const notification = await Notification.create(req.body);
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la notificación', error });
    }
};

export const updateNotification = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [updated] = await Notification.update(req.body, {
            where: { id: id }
        });
        if (updated) {
            const updatedNotification = await Notification.findOne({ where: { id: id } });
            res.status(200).json({ notification: updatedNotification });
        } else {
            res.status(404).json({ message: 'Notificación no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la notificación', error });
    }
};

export const deleteNotification = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await Notification.destroy({
            where: { id: id }
        });
        if (deleted) {
            res.status(204).json({ message: 'Notificación eliminada' });
        } else {
            res.status(404).json({ message: 'Notificación no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la notificación', error });
    }
};
