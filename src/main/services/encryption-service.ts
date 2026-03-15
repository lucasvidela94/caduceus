import * as crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const ITERATIONS = 100000;

let encryptionKey: Buffer | null = null;

const deriveKey = (password: string, salt: Buffer): Buffer => {
  return crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, "sha512");
};

export const initializeEncryption = (password: string): void => {
  const salt = crypto.randomBytes(SALT_LENGTH);
  encryptionKey = deriveKey(password, salt);
};

export const setEncryptionKey = (key: Buffer): void => {
  encryptionKey = key;
};

const getKey = (): Buffer => {
  if (!encryptionKey) {
    throw new Error("Encryption not initialized. Call initializeEncryption() first.");
  }
  return encryptionKey;
};

export const encrypt = (plaintext: string): string => {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");

  const tag = cipher.getAuthTag();

  return iv.toString("hex") + ":" + tag.toString("hex") + ":" + encrypted;
};

export const decrypt = (ciphertext: string): string => {
  const key = getKey();
  const parts = ciphertext.split(":");

  if (parts.length !== 3) {
    throw new Error("Invalid ciphertext format");
  }

  const iv = Buffer.from(parts[0], "hex");
  const tag = Buffer.from(parts[1], "hex");
  const encrypted = parts[2];

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};

export const generateSecurePassword = (length: number = 32): string => {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
};
