import EfiPay from "sdk-node-apis-efi";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const options = {
  sandbox: true, // true = homologação, false = produção
  client_id: process.env.EFI_CLIENT_ID,
  client_secret: process.env.EFI_CLIENT_SECRET,
  certificate: path.resolve("./certs/homologacao.p12"), // caminho do seu certificado
};

const efipay = new EfiPay(options);

// Criar cobrança PIX
export async function criarCobranca(valor, cpf, nome, txid) {
  const body = {
    calendario: { expiracao: 3600 },
    devedor: { cpf, nome },
    valor: { original: valor.toFixed(2) },
    chave: process.env.EFI_PIX_KEY, // sua chave PIX cadastrada
    solicitacaoPagador: "Pagamento do pedido",
  };

  try {
    const response = await efipay.pixCreateImmediateCharge([], body);
    return response;
  } catch (error) {
    console.error("Erro ao criar cobrança:", error.response?.data || error.message);
    throw error;
  }
}

// Consultar status de cobrança
export async function consultarCobranca(txid) {
  try {
    const response = await efipay.pixDetailCharge({ txid });
    return response;
  } catch (error) {
    console.error("Erro ao consultar cobrança:", error.response?.data || error.message);
    throw error;
  }
}
