import express from 'express';
import { criarCobranca, consultarCobranca } from './pixService.js';

const app = express();
app.use(express.json());

// Endpoint para criar PIX
app.post('/api/pix/cobrar', async (req, res) => {
  try {
    const { valor, cpf, nome, txid } = req.body;
    const cobranca = await criarCobranca(parseFloat(valor), cpf, nome, txid);
    res.json(cobranca);
  } catch (err) {
    res.status(500).json({ erro: "Falha ao gerar PIX" });
  }
});

// Endpoint para consultar PIX
app.get('/api/pix/:txid', async (req, res) => {
  try {
    const status = await consultarCobranca(req.params.txid);
    res.json(status);
  } catch (err) {
    res.status(500).json({ erro: "Falha ao consultar PIX" });
  }
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
