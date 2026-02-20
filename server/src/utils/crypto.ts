import crypto from 'crypto';
import { AppError } from './errors.js';

function getEncKey(): Buffer {
  const keyB64 = process.env.TOKEN_ENC_KEY;
  if (!keyB64) {
    throw new AppError('Missing TOKEN_ENC_KEY', 500, 'CONFIG_ERROR');
  }
  const buf = Buffer.from(keyB64, 'base64');
  if (buf.length !== 32) {
    throw new AppError('TOKEN_ENC_KEY must be 32 bytes base64', 500, 'CONFIG_ERROR');
  }
  return buf;
}

export function encryptJson(data: unknown): string {
  const key = getEncKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const plaintext = Buffer.from(JSON.stringify(data), 'utf8');
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ciphertext]).toString('base64url');
}

export function decryptJson<T>(enc: string): T {
  const key = getEncKey();
  const buf = Buffer.from(enc, 'base64url');
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const ciphertext = buf.subarray(28);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return JSON.parse(plaintext.toString('utf8')) as T;
}

export function randomBase64Url(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('base64url');
}
