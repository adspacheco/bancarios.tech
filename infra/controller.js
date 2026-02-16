import {
  InternalServerError,
  MethodNotAllowedError,
  NotFoundError,
  ValidationError,
} from "infra/errors.js";

/**
 * Handler para quando a rota existe mas o método HTTP não é suportado.
 * Responde com 405 (Method Not Allowed).
 *
 * @param {import("http").IncomingMessage} request
 * @param {import("http").ServerResponse} response
 */
function onNoMatchHandler(request, response) {
  const publicErrorObject = new MethodNotAllowedError();
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

/**
 * Handler global de erros. Se o erro for um `ValidationError` ou `NotFoundError`,
 * repassa direto com seu status code. Qualquer outro erro é encapsulado em um
 * `InternalServerError`.
 *
 * @param {Error} error - Erro capturado pelo next-connect.
 * @param {import("http").IncomingMessage} request
 * @param {import("http").ServerResponse} response
 */
function onErrorHandler(error, request, response) {
  if (error instanceof ValidationError || error instanceof NotFoundError) {
    return response.status(error.statusCode).json(error);
  }

  const publicErrorObject = new InternalServerError({
    statusCode: error.statusCode,
    cause: error,
  });

  console.error(publicErrorObject);

  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};

export default controller;
