import { Router } from 'express';
import { getNotifications, createNotification, updateNotification, deleteNotification } from '../controllers/notifications.controller';

const router = Router();

// Obtener todas las notificaciones
router.get('/', getNotifications);

// Crear una nueva notificación
router.post('/', createNotification);

// Actualizar una notificación por ID
router.put('/:id', updateNotification);

// Eliminar una notificación por ID
router.delete('/:id', deleteNotification);

export default router;
