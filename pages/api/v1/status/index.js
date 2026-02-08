/**
 * Retorna o status da API.
 * @param {import('next').NextApiRequest} request - Objeto de requisição HTTP.
 * @param {import('next').NextApiResponse} response - Objeto de resposta HTTP.
 */
function status(request, response) {
  response.status(200).json({
    tech: "bancários",
  });
}

export default status;
