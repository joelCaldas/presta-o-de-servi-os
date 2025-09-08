// src/routes/pixRoutes.js
import express from "express";
import { v4 as uuidv4 } from "uuid";
import EfiPay from "sdk-node-apis-efi";

const router = express.Router();

// Configurações da Efí (pegando do .env)
const options = {
  sandbox: true, // coloque false em produção
  client_id: process.env.EFI_CLIENT_ID,
  client_secret: process.env.EFI_CLIENT_SECRET,
  certificate: process.env.EFI_CERT, // caminho do seu .p12
};

const efipay = new EfiPay(options);

// Rota para criar uma cobrança PIX
router.post("/criar-cobranca", async (req, res) => {
  try {
    const txid = uuidv4().slice(0, 35); // TXID máx 35 caracteres
    const body = {
      calendario: { expiracao: 3600 },
      valor: { original: req.body.valor || "1.00" },
      chave: process.env.EFI_PIX_KEY, // chave PIX cadastrada no Efí
      solicitacaoPagador: "Pagamento do pedido",
    };

    const cobranca = await efipay.pixCreateCharge([], body);
    const qrCode = await efipay.pixGenerateQRCode({
      id: cobranca.loc.id,
    });

    res.json({
      txid,
      copiaCola: qrCode.qrcode,
      imagemQrcode: qrCode.imagemQrcode,
    });
  } catch (error) {
    console.error("Erro ao criar cobrança PIX:", error.response?.data || error);
    res.status(500).json({ error: "Erro ao criar cobrança PIX" });
  }
});

export default router;
