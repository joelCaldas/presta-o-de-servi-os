import { buildBRCode } from '../utils/pix.js';
import { charges } from '../db.js';


const MERCHANT_NAME = 'NOME VENDEDOR';
const MERCHANT_CITY = 'BELEM';
const PIX_KEY = '70103625216'; // exemplo


export async function createCharge({ amount, description, txid, expiresInSec = 15 * 60 }) {
const brcode = buildBRCode({
pixKey: PIX_KEY,
merchantName: MERCHANT_NAME,
merchantCity: MERCHANT_CITY,
amount,
txid
});


const now = new Date();
const expiresAt = new Date(now.getTime() + expiresInSec * 1000);


const charge = {
txid,
amount,
description,
status: 'PENDING',
brcode,
createdAt: now,
expiresAt
};


charges.set(txid, charge);


// Simula confirmação automática após 10s
setTimeout(() => {
const c = charges.get(txid);
if (c && c.status === 'PENDING') {
c.status = 'CONFIRMED';
charges.set(txid, c);
}
}, 10_000);


return { txid, brcode, expiresAt };
}


export async function getCharge(txid) {
return charges.get(txid) || null;
}


export async function cancelCharge(txid) {
const c = charges.get(txid);
if (c) {
c.status = 'CANCELLED';
charges.set(txid, c);
}
return c;
}


export async function handleWebhook(reqBody) {
// No mock, apenas marca como confirmado
const { txid } = reqBody || {};
const c = charges.get(txid);
if (c) {
c.status = 'CONFIRMED';
charges.set(txid, c);
}
}