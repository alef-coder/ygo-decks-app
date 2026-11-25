import { API_URL } from '../config';

async function requisicao(caminho, opcoes = {}) {
  let resposta;
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      headers: { 'Content-Type': 'application/json' },
      ...opcoes,
    });
  } catch (e) {
    throw new Error(
      `Não foi possível conectar ao servidor (${API_URL}). Verifique se o backend está rodando e se o celular está na mesma rede Wi-Fi.`
    );
  }

  const dados = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    throw new Error(dados?.erro || `Erro ${resposta.status}`);
  }
  return dados;
}

export const listarDecks = () => requisicao('/decks');

export const criarDeck = (deck) =>
  requisicao('/decks', { method: 'POST', body: JSON.stringify(deck) });

export const editarDeck = (id, deck) =>
  requisicao(`/decks/${id}`, { method: 'PUT', body: JSON.stringify(deck) });

export const excluirDeck = (id) =>
  requisicao(`/decks/${id}`, { method: 'DELETE' });