import { Notification } from '../models/notification';
import fcmService from './fcmService';

class NotificationService {
    // Create a new notification and send a push notification.
    async createNotification(data: any): Promise<Notification> {
        const notification = await Notification.create(data);

        // Send a push notification if the user has an FCM token.
        // if (notification.tokenDevice) {
        //     const title = 'New Notification';
        //     const body = 'You have a new notification in the app.';
        //     await fcmService.sendNotification(notification.tokenDevice, title, body);
        // }

        return notification;
    }

    // Update an existing notification.
    async updateNotification(id: number, data: any): Promise<Notification | null> {
        await Notification.update(data, { where: { id } });
        return Notification.findOne({ where: { id } });
    }

    // Delete a notification.
    async deleteNotification(id: number): Promise<void> {
        await Notification.destroy({ where: { id } });
    }
}

export default new NotificationService();
