import database from "../../../../infra/database.js";

/**
 * Retorna o status da API.
 * @param {import('next').NextApiRequest} request - Objeto de requisição HTTP.
 * @param {import('next').NextApiResponse} response - Objeto de resposta HTTP.
 */
async function status(request, response) {
  const result = await database.query("SELECT 1 + 1 as sum;");
  console.log(result.rows);
  response.status(200).json({
    tech: "bancários",
  });
}

export default status;
