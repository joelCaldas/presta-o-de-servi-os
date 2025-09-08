// Armazenamento em memória para exemplo.
// Troque por Redis/PostgreSQL em produção.


export const charges = new Map();
// Estrutura: charges.set(txid, {
// txid, amount, description, status: 'PENDING'|'CONFIRMED'|'EXPIRED'|'CANCELLED',
// brcode, expiresAt: Date, createdAt: Date
// })