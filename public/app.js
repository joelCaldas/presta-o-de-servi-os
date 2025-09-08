// src/routes/pix.js
const express = require("express");
const QRCode = require("qrcode");

const router = express.Router();

router.post("/create-charge", async (req, res) => {
  try {
    const payload = "00020126580014BR.GOV.BCB.PIX0136chavepix@exemplo.com5204000053039865405100.005802BR5920Loja de Teste Ltda6009SAO PAULO62070503***6304ABCD";

    const qrCodeBase64 = await QRCode.toDataURL(payload);

    res.json({
      qrCodeImage: qrCodeBase64,
      pixCopiaCola: payload
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao gerar Pix" });
  }
});

module.exports = router;
