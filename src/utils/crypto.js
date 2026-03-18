export async function generateKeyPair() {
  const keyPair = await window.crypto.subtle.generateKey(
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['sign', 'verify']
  );
  const publicKeyRaw = await window.crypto.subtle.exportKey('raw', keyPair.publicKey);
  const publicKeyHex = Array.from(new Uint8Array(publicKeyRaw))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return {
    keyPair,
    publicKey: publicKeyHex,
    shortId: publicKeyHex.slice(0, 8) + '...' + publicKeyHex.slice(-8),
  };
}

export function generateNodeId() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function fromHex(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

async function deriveKey(passphrase, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveKey']
  );
  return window.crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptIdentity(identityData, passphrase) {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);
  const enc = new TextEncoder();
  const ciphertext = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(JSON.stringify(identityData))
  );
  return JSON.stringify({
    v: 1,
    salt: toHex(salt),
    iv: toHex(iv),
    data: toHex(ciphertext),
  });
}

export async function decryptIdentity(fileContent, passphrase) {
  const { salt, iv, data } = JSON.parse(fileContent);
  const key = await deriveKey(passphrase, fromHex(salt));
  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: fromHex(iv) },
    key,
    fromHex(data)
  );
  return JSON.parse(new TextDecoder().decode(decrypted));
}

export function downloadFile(content, filename) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function getPassphraseStrength(passphrase) {
  if (!passphrase || passphrase.length < 8) return { level: 'weak', label: 'Слабая' };
  let score = 0;
  if (passphrase.length >= 12) score++;
  if (passphrase.length >= 20) score++;
  if (/[A-ZА-ЯЁ]/.test(passphrase) && /[a-zа-яё]/.test(passphrase)) score++;
  if (/\d/.test(passphrase)) score++;
  if (/[^a-zA-Zа-яА-ЯёЁ0-9\s]/.test(passphrase)) score++;
  if (score <= 1) return { level: 'weak', label: 'Слабая' };
  if (score <= 3) return { level: 'medium', label: 'Средняя' };
  return { level: 'strong', label: 'Сильная' };
}
