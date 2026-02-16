/**
 * Erro interno do servidor (HTTP 500).
 * Encapsula o erro original e expõe uma mensagem segura para o cliente.
 *
 * @extends Error
 */
export class InternalServerError extends Error {
  /**
   * @param {Object} params
   * @param {Error} params.cause - Erro original que causou a falha.
   */
  constructor({ cause }) {
    super("Um erro interno não esperado aconteceu.", {
      cause,
    });
    this.name = "InternalServerError";
    this.action = "Entre em contato com o suporte.";
    this.statusCode = 500;
  }

  /**
   * Serializa o erro para JSON, expondo apenas informações seguras.
   *
   * @returns {{name: string, message: string, action: string, status_code: number}}
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
