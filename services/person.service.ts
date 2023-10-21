import { notificationCodeVerification } from "../utils/emailTemplates";
import { generateRandomCode } from "../utils/generateCode";
import { sendEmail } from "../utils/sendEmail";
import { Person } from "../models/person";

class PersonService {
    private verificationCodes = new Map<string, string>();

    async generateAndSendVerificationCode(email: string): Promise<boolean> {
        const existingUser = await Person.findByPk(email);
            if(!existingUser) {
                return false
            }
            const code = generateRandomCode();
            this.storeCode(email, code);
            const formattedEmail = notificationCodeVerification(email, code);
            sendEmail(formattedEmail);
            return true
    }

    verifyCode(email: string, code: string): boolean {
        const storedCode = this.verificationCodes.get(email);
        if (storedCode === code) {
            this.verificationCodes.delete(email); // Elimina el código una vez verificado
            return true;
        }
        return false;
    }

    private storeCode(email: string, code: string): void {
        this.verificationCodes.set(email, code);
        // Establecer un tiempo de expiración para eliminar el código después de un tiempo (por ejemplo, 10 minutos)
        setTimeout(() => {
            this.verificationCodes.delete(email);
        }, 10 * 60 * 1000);
    }
}

export default new PersonService();
