import { Notification } from '../models/notification';
import fcmService from './fcmService';
import cron from "node-cron";
import moment from "moment-timezone"

class NotificationService {
    // Create a new notification and send a push notification.
    async createNotification(data: any): Promise<Notification> {
        const notification = await Notification.create(data);
        const { title, description, date, tokenDevice } = data;

        const timezone = 'America/Costa_Rica';

        const currentDate = moment.tz(timezone);
        const scheduledDate = moment.tz(date, timezone);

        // Check if the scheduled date is in the future
        console.log(scheduledDate,currentDate);
        if (scheduledDate.isAfter(currentDate)) {
            // Convert the scheduled date to a cron expression
            const cronExpression = `${scheduledDate.minute()} ${scheduledDate.hour()} ${scheduledDate.date()} ${scheduledDate.month() + 1} *`;
    
            cron.schedule(cronExpression, async () => {
                if (tokenDevice) {
                    await fcmService.sendNotification(tokenDevice, title, description);
                }
            });
        } else {
            // Send the notification immediately if the date is not in the future
            if (tokenDevice) {
                await fcmService.sendNotification(tokenDevice, title, description);
            }
        }

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
