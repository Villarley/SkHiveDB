import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_ID);

export async function googleVerify(token: string): Promise<{ name?: string; family_name?: string; email?: string }> {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_ID,
  });

  const payload = ticket.getPayload();
  const { name, family_name, email } = payload || {}; // Usar desestructuración con un objeto vacío por defecto

  return { name, family_name, email };
}

