import { getRandomValues } from 'node:crypto';

function randomAddress() {
  const buf = getRandomValues(new Uint8Array(20));
  const adr = `0x${Array.from(buf)
    .map(x => {
      return x.toString(16).padStart(2, '0');
    })
    .join('')}`;
  return adr;
}

function randomString(len = 10) {
  let ret = '';
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < len; ++i) {
    ret += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ret;
}

function randomNumber(len = 8) {
  let ret = '';
  const chars = '0123456789';
  for (let i = 0; i < len; ++i) {
    ret += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ret;
}

// 4665b011-55d6-48ff-8128-bd1a86ecf0dd
function UUID() {
  const buf = getRandomValues(new Uint8Array(16));
  const hex = Array.from(buf)
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export { randomAddress, randomString, randomNumber, UUID };
