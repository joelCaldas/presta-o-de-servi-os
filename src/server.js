// src/server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { EfiPay } from "sdk-node-apis-efi";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Corrige __dirname para ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "..", "public")));

// ---------------- EFÍ CONFIG ---------------- //
const options = {
  client_id: process.env.EFI_CLIENT_ID,
  client_secret: process.env.EFI_CLIENT_SECRET,
  certificate: process.env.EFI_CERT, // caminho do certificado .pem
  sandbox: true, // coloque false em produção
};
const efipay = new EfiPay(options);

// ---------------- ROTAS ---------------- //
app.get("/api", (req, res) => {
  res.send("🚀 API de Integração Bancária rodando!");
});

// ---------------- PIX CHECKOUT ---------------- //
app.post("/pix/checkout", async (req, res) => {
  try {
    const body = {
      calendario: { expiracao: 3600 }, // expira em 1h
      devedor: { cpf: "12345678909", nome: "Cliente Teste" },
      valor: { original: "10.00" }, // valor do PIX
      chave: process.env.EFI_PIX_KEY, // sua chave pix cadastrada
      solicitacaoPagador: "Pagamento de teste",
    };

    const response = await efipay.pixCreateImmediateCharge([], body);
    const qrcode = await efipay.pixGenerateQRCode({
      id: response.loc.id,
    });

    res.json({
      success: true,
      pixCode: qrcode.qrcode,
      qrCode: qrcode.imagemQrcode,
      expiresIn: 3600,
    });
  } catch (err) {
    console.error("Erro ao gerar PIX:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------- START SERVER ---------------- //
app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando em http://localhost:${PORT}`);
});
