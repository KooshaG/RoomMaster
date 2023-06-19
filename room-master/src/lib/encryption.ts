import AES from 'crypto-js/aes';
import utf8 from 'crypto-js/enc-utf8';


const key = process.env.AUTH_SECRET;

export function encrypt(plainPassword: string) {
  if (!key) {throw new Error("Encryption key not found");}
  return AES.encrypt(plainPassword, key).toString();
}

export function decrypt(hashPassword: string) {
  if (!key) {throw new Error("Encryption key not found");}
  return AES.decrypt(hashPassword, key).toString(utf8);
}


