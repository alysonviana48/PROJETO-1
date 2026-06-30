import { MOCK_PASSWORD, MOCK_USERNAME } from '../constants/mockCredentials';

/**
 * Compara usuário e senha com as credenciais mockadas do projeto.
 * Não há chamada a API; apenas comparação em memória.
 *
 * @param username - Valor digitado no campo de usuário (pode aplicar trim).
 * @param password - Valor digitado no campo de senha.
 * @returns true se bater com o mock; caso contrário false.
 */
export function validateMockLogin(username: string, password: string): boolean {
  return username.trim() === MOCK_USERNAME && password === MOCK_PASSWORD;
}