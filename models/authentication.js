import user from "models/user.js";
import password from "models/password.js";
import { NotFoundError, UnauthorizedError } from "infra/errors.js";

/**
 * Autentica um usuário verificando email e senha.
 *
 * O fluxo converte erros específicos (NotFoundError, senha incorreta)
 * em um UnauthorizedError genérico para não revelar qual campo está errado.
 *
 * @param {string} providedEmail - Email enviado pelo cliente.
 * @param {string} providedPassword - Senha em texto puro enviada pelo cliente.
 * @returns {Promise<import("models/user.js").User>} Objeto do usuário autenticado.
 * @throws {UnauthorizedError} Se email ou senha não conferem.
 */
async function getAuthenticatedUser(providedEmail, providedPassword) {
  try {
    const storedUser = await findUserByEmail(providedEmail);
    await validatePassword(providedPassword, storedUser.password);

    return storedUser;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: "Dados de autenticação não conferem.",
        action: "Verifique se os dados enviados estão corretos.",
      });
    }

    throw error;
  }

  /**
   * Busca o usuário pelo email, convertendo NotFoundError em UnauthorizedError.
   *
   * @param {string} providedEmail
   * @returns {Promise<import("models/user.js").User>}
   * @throws {UnauthorizedError} Se o email não for encontrado.
   */
  async function findUserByEmail(providedEmail) {
    let storedUser;

    try {
      storedUser = await user.findOneByEmail(providedEmail);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new UnauthorizedError({
          message: "Email não confere.",
          action: "Verifique se este dado está correto.",
        });
      }

      throw error;
    }

    return storedUser;
  }

  /**
   * Compara a senha fornecida com o hash armazenado via bcrypt.
   *
   * @param {string} providedPassword - Senha em texto puro.
   * @param {string} storedPassword - Hash bcrypt armazenado no banco.
   * @throws {UnauthorizedError} Se a senha não corresponder ao hash.
   */
  async function validatePassword(providedPassword, storedPassword) {
    const correctPasswordMatch = await password.compare(
      providedPassword,
      storedPassword,
    );

    if (!correctPasswordMatch) {
      throw new UnauthorizedError({
        message: "Senha não confere.",
        action: "Verifique se este dado está correto.",
      });
    }
  }
}

const authentication = {
  getAuthenticatedUser,
};

export default authentication;
