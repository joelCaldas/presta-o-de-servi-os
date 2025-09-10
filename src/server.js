// src/server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import pixRoutes from "./routes/pixRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Corrige __dirname no ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Servir frontend da pasta /public
app.use(express.static(path.join(__dirname, "..", "public")));

// Rotas PIX
app.use("/pix", pixRoutes);

// Teste rápido
app.get("/api", (req, res) => {
  res.send("🚀 API com PIX Efí Online!");
});

// Start do servidor
app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando em http://localhost:${PORT}`);
});
