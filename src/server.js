// src/server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

// Importa o provider do C6 (futuro, pode ser real ou mock)
import c6Provider from "./providers/c6.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Corrige __dirname para funcionar em ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Servir arquivos estáticos do frontend (index.html e app.js em /public)
app.use(express.static(path.join(__dirname, "..", "public")));

// ---------------- ROTAS ---------------- //

// Rota simples de teste
app.get("/api", (req, res) => {
  res.send("🚀 API de Integração Bancária rodando!");
});

// Rota para consultar saldo no C6
app.get("/api/c6/saldo", async (req, res) => {
  try {
    const saldo = await c6Provider.consultarSaldo();
    res.json({ banco: "C6", saldo });
  } catch (err) {
    console.error("Erro ao consultar saldo no C6:", err.message);
    res.status(500).json({ error: "Erro ao consultar saldo no C6" });
  }
});

// Rota para listar transações do C6
app.get("/api/c6/transacoes", async (req, res) => {
  try {
    const transacoes = await c6Provider.listarTransacoes();
    res.json({ banco: "C6", transacoes });
  } catch (err) {
    console.error("Erro ao listar transações no C6:", err.message);
    res.status(500).json({ error: "Erro ao listar transações no C6" });
  }
});

// ---------------- PIX CHECKOUT ---------------- //
app.post("/pix/checkout", async (req, res) => {
  try {
    // aqui futuramente pode integrar com o provider real (c6Provider.gerarCobranca())
    const fakePixCode =
      "00020126360014BR.GOV.BCB.PIX0114+55999999999952040000530398654041.905802BR5925NOME DO RECEBEDOR6009SaoPaulo62070503***6304ABCD";
    const fakeQrCodeUrl =
      "https://placehold.co/256x256/eeeeee/000000?text=QR+PIX";

    res.json({
      success: true,
      pixCode: fakePixCode,
      qrCode: fakeQrCodeUrl,
      expiresIn: 15 * 60, // expira em 15 minutos
    });
  } catch (err) {
    console.error("Erro ao gerar PIX:", err.message);
    res
      .status(500)
      .json({ success: false, error: "Erro ao gerar cobrança PIX" });
  }
});

// ---------------- START SERVER ---------------- //
app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando em http://localhost:${PORT}`);
});
