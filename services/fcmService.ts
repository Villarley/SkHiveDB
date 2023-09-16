// fcmService.ts

import { messaging } from '../config/firebaseConfig';

class FCMService {
  
    async storeToken(token: string): Promise<string> {
      return 'Token stored successfully';
    }
  
    async sendNotification(token: string, title: string, body: string): Promise<string> {
      const message = {
        token: token,
        notification: {
          title: title,
          body: body,
        },
      };
  
      await messaging.send(message);
      return 'Notification sent successfully';
    }
  }
  
  export default new FCMService();
