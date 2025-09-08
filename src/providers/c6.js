// src/providers/c6.js

import axios from "axios";

// URL base da API do C6 (coloque a real depois)
const api = axios.create({
  baseURL: "https://api.c6bank.com.br", 
  timeout: 10000,
});

// Função para autenticar
export async function autenticar(clientId, clientSecret) {
  try {
    const response = await api.post("/oauth/token", {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    });

    const token = response.data.access_token;
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    return token;
  } catch (error) {
    console.error("Erro ao autenticar no C6:", error.message);
    throw error;
  }
}

// Exemplo de consulta de saldo
export async function consultarSaldo(contaId) {
  try {
    const response = await api.get(`/contas/${contaId}/saldo`);
    return response.data;
  } catch (error) {
    console.error("Erro ao consultar saldo:", error.message);
    throw error;
  }
}

export default api;
