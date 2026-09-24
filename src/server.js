import http from 'http';
import { json } from "./middlewares/json.js";
import { routes } from "./routes.js";

const server = http.createServer(async (request, response) => {
    try {
    await json(request, response);
    if (request.jsonInvalido) return response.writeHead(400).end(JSON.stringify({ erro: "JSON inválido" }));
    const url = new URL(request.url, `http://${request.headers.host}`);
    const caminho = url.pathname;
    const metodo = request.method;
    const route = routes.find(route => route.method === metodo && route.path.test(caminho));

    if (route) {
        const routeParams = caminho.match(route.path);
        request.params = routeParams ? routeParams.groups : {};
        request.query = Object.fromEntries(url.searchParams.entries());

        return await route.handler(request, response);
    }
    response.writeHead(404)
    response.end(JSON.stringify("Erro 404: Rota não encontrada"));
    } catch (error) {
        console.error('Erro ao processar requisição:', error);
        if (!response.headersSent) response.writeHead(500);
        if (!response.writableEnded) response.end(JSON.stringify({ erro: "Erro interno do servidor" }));
    }
});

server.listen(3000, () => {
    console.log("Servidor rodando! Acesse: http://localhost:3000/tasks no seu navegador.");
});
