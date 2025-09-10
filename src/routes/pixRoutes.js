// src/routes/pixRoutes.js
import express from "express";
import { v4 as uuidv4 } from "uuid";
import EfiPay from "sdk-node-apis-efi";

const router = express.Router();

// Instância do cliente Efí
const efipay = new EfiPay({
  client_id: process.env.EFI_CLIENT_ID,
  client_secret: process.env.EFI_CLIENT_SECRET,
  certificate: process.env.EFI_CERT,
  sandbox: process.env.EFI_SANDBOX === "true",
});

// Criar cobrança PIX e gerar QR Code
router.post("/cobrar", async (req, res) => {
  try {
    const txid = uuidv4().slice(0, 35);

    const body = {
      calendario: { expiracao: 3600 }, // 1h
      valor: { original: Number(req.body.valor || 1).toFixed(2) }, // valor passado pelo front
      chave: process.env.EFI_PIX_KEY, // sua chave PIX
      solicitacaoPagador: req.body.descricao || "Pagamento de serviço",
    };

    // Cria cobrança
    const charge = await efipay.pixCreateCharge([], body);

    // Gera QR Code do pagamento
    const qr = await efipay.pixGenerateQRCode({ id: charge.loc.id });

    res.json({
      success: true,
      txid,
      copieCola: qr.qrcode,
      qrImagem: qr.imagemQrcode,
    });
  } catch (err) {
    console.error("Erro ao gerar PIX:", err.response?.data || err.message);
    res.status(500).json({ success: false, error: "Erro ao gerar PIX" });
  }
});

export default router;
