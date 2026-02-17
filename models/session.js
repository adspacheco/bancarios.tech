import crypto from "node:crypto";
import database from "infra/database.js";

/**
 * @typedef {object} Session
 * @property {string} id
 * @property {string} token - Token aleatório de 48 bytes em hex (96 caracteres).
 * @property {string} user_id
 * @property {Date} expires_at
 * @property {Date} created_at
 * @property {Date} updated_at
 */

/** Tempo de expiração da sessão: 30 dias em milissegundos. */
const EXPIRATION_IN_MILLISECONDS = 60 * 60 * 24 * 30 * 1000;

/**
 * Cria uma nova sessão para o usuário com token aleatório e expiração de 30 dias.
 *
 * @param {string} userId - ID do usuário dono da sessão.
 * @returns {Promise<Session>} Objeto da sessão recém-criada (todas as colunas via RETURNING *).
 */
async function create(userId) {
  const token = crypto.randomBytes(48).toString("hex");
  const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);

  const newSession = await runInsertQuery(token, userId, expiresAt);
  return newSession;

  /**
   * Executa o INSERT no banco e retorna a sessão criada.
   *
   * @param {string} token
   * @param {string} userId
   * @param {Date} expiresAt
   * @returns {Promise<Session>} Linha inserida retornada pelo RETURNING *.
   */
  async function runInsertQuery(token, userId, expiresAt) {
    const results = await database.query({
      text: `
        INSERT INTO
          sessions (token, user_id, expires_at)
        VALUES
          ($1, $2, $3)
        RETURNING
          *
      ;`,
      values: [token, userId, expiresAt],
    });

    return results.rows[0];
  }
}

const session = {
  create,
  EXPIRATION_IN_MILLISECONDS,
};

export default session;
