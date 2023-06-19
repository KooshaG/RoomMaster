const CryptoJS = require('crypto-js')


const key = process.env.AUTH_SECRET;

export function encrypt(plainPassword: string) {
  if (!key) {throw new Error("Encryption key not found");}
  return CryptoJS.AES.encrypt(plainPassword, key).toString();
}

export function decrypt(hashPassword: string) {
  if (!key) {throw new Error("Encryption key not found");}
  return CryptoJS.AES.decrypt(hashPassword, key).toString(CryptoJS.enc.Utf8);
}


