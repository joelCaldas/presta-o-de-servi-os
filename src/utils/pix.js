// Utilitários para gerar BR Code (EMV) e CRC16-CCITT (FALSE)


function emv(id, value) {
const len = String(value.length).padStart(2, '0');
return `${id}${len}${value}`;
}


export function crc16ccitt(str) {
let crc = 0xffff;
for (let i = 0; i < str.length; i++) {
crc ^= str.charCodeAt(i) << 8;
for (let j = 0; j < 8; j++) {
crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : (crc << 1);
crc &= 0xffff;
}
}
return crc.toString(16).toUpperCase().padStart(4, '0');
}


export function buildBRCode({ pixKey, merchantName, merchantCity, amount, txid }) {
const payload = [
emv('00', '01'), // Payload Format Indicator
emv('26', emv('00', 'br.gov.bcb.pix') + emv('01', pixKey)),
emv('52', '0000'), // MCC
emv('53', '986'), // BRL
emv('54', String(amount)),
emv('58', 'BR'),
emv('59', merchantName.slice(0,25) || 'LOJA ONLINE'),
emv('60', merchantCity.slice(0,15) || 'CIDADE'),
emv('62', emv('05', txid || '***'))
].join('');


const withCrcId = payload + '6304';
const crc = crc16ccitt(withCrcId);
return withCrcId + crc;
}