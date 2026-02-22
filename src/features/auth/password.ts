import * as Crypto from 'expo-crypto';
import { pbkdf2Async } from '@noble/hashes/pbkdf2.js';
import { sha256 } from '@noble/hashes/sha2.js';

const PBKDF2_ITERATIONS = __DEV__ ? 200 : 10_000;
const LEGACY_PBKDF2_ITERATIONS = [30_000, 50_000, 100_000] as const;
const HASH_VERSION = 'v2';
const PBKDF2_KEY_LENGTH = 32;
const SALT_BYTES = 16;

const toHex = (bytes: Uint8Array) =>
  Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

const fromHex = (hex: string) => {
  const pairs = hex.match(/.{1,2}/g) ?? [];
  return Uint8Array.from(pairs.map((pair) => Number.parseInt(pair, 16)));
};

const getEncoder = () => new TextEncoder();

export const createPasswordHash = async (password: string) => {
  const saltBytes = await Crypto.getRandomBytesAsync(SALT_BYTES);
  const saltHex = toHex(saltBytes);
  const hashHex = await hashPasswordWithSaltAsync(password, saltHex, PBKDF2_ITERATIONS);
  return { passwordHash: formatHash(PBKDF2_ITERATIONS, hashHex), passwordSalt: saltHex };
};

export interface VerifyPasswordResult {
  readonly isValid: boolean;
  readonly needsUpgrade: boolean;
}

export const verifyPassword = async (
  password: string,
  saltHex: string,
  expectedHash: string,
): Promise<VerifyPasswordResult> => {
  const parsedHash = parseStoredHash(expectedHash);
  if (parsedHash) {
    const hashHex = await hashPasswordWithSaltAsync(password, saltHex, parsedHash.iterations);
    if (hashHex !== parsedHash.hashHex) {
      return { isValid: false, needsUpgrade: false };
    }
    return { isValid: true, needsUpgrade: parsedHash.iterations !== PBKDF2_ITERATIONS };
  }

  for (const iterations of LEGACY_PBKDF2_ITERATIONS) {
    const legacyHashHex = await hashPasswordWithSaltAsync(password, saltHex, iterations);
    if (legacyHashHex === expectedHash) {
      return { isValid: true, needsUpgrade: true };
    }
  }
  return { isValid: false, needsUpgrade: false };
};

const formatHash = (iterations: number, hashHex: string) => `${HASH_VERSION}:${iterations}$${hashHex}`;

const parseStoredHash = (storedHash: string) => {
  if (!storedHash.startsWith(`${HASH_VERSION}:`)) {
    return null;
  }
  const [prefix, hashHex] = storedHash.split('$');
  if (!prefix || !hashHex) {
    return null;
  }
  const [, iterationText] = prefix.split(':');
  const iterations = Number.parseInt(iterationText ?? '', 10);
  if (!Number.isFinite(iterations) || iterations <= 0) {
    return null;
  }
  return { iterations, hashHex } as const;
};

const hashPasswordWithSaltAsync = async (password: string, saltHex: string, iterations: number) => {
  const encoder = getEncoder();
  const passwordBytes = encoder.encode(password);
  const saltBytes = fromHex(saltHex);
  const hashBytes = await pbkdf2Async(sha256, passwordBytes, saltBytes, {
    c: iterations,
    dkLen: PBKDF2_KEY_LENGTH,
  });
  return toHex(hashBytes);
};
