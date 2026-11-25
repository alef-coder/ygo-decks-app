import Constants from 'expo-constants';

// Se a detecção automática falhar, escreva aqui o IP do PC com a porta.
// Exemplo: 'http://192.168.0.105:3000'
const URL_MANUAL = '';

// O Expo Go já conhece o IP do PC que está servindo o app.
// Usamos esse mesmo IP para falar com o backend, que roda na porta 3000.
function descobrirUrl() {
  if (URL_MANUAL) return URL_MANUAL;
  const host = Constants.expoConfig?.hostUri?.split(':')[0];
  return host ? `http://${host}:3000` : 'http://localhost:3000';
}

export const API_URL = descobrirUrl();