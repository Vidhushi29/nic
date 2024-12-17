import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  AES_KEY = 'UIYE7R94R93734N9';

  constructor() { }

  encryption(jsonData) {

    const key = CryptoJS.enc.Utf8.parse(this.AES_KEY);
    const iv = CryptoJS.enc.Utf8.parse(this.AES_KEY);

    const encryptedText = CryptoJS.AES.encrypt(
      JSON.stringify(jsonData),
      key, {
                  keySize: 128,
                  blockSize: 128,
                  iv: iv,
                  mode: CryptoJS.mode.CBC,
                  padding: CryptoJS.pad.Pkcs7
                }
    ).toString();

    return encryptedText;
  }

  decryption(encryptedText) {

    const key = CryptoJS.enc.Utf8.parse(this.AES_KEY);
    const iv = CryptoJS.enc.Utf8.parse(this.AES_KEY);
    console.log("dasdsad", encryptedText)
    const base64Decoded = CryptoJS.AES.decrypt(
      encryptedText,
      key, {
                  keySize: 128,
                  blockSize: 128,
                  iv: iv,
                  mode: CryptoJS.mode.CBC,
                  padding: CryptoJS.pad.Pkcs7
                }
    ).toString(CryptoJS.enc.Utf8);
    return base64Decoded;
  }
}
