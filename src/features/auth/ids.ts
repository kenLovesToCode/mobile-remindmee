import * as Crypto from 'expo-crypto';

const ID_BYTES = 16;

const toHex = (bytes: Uint8Array) =>
  Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

export const createId = async () => {
  const bytes = await Crypto.getRandomBytesAsync(ID_BYTES);
  return toHex(bytes);
};
