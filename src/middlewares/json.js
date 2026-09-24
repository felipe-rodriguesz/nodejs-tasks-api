export async function json(request, response) {
    response.setHeader("content-type", "application/json");
    let pedacosDoBody = [];

    for await (const pedaco of request) {
        pedacosDoBody.push(pedaco)
    }

    const textoBody = Buffer.concat(pedacosDoBody).toString();
    if (!textoBody) {
        request.body = undefined;
        return;
    }
    try {
        request.body = JSON.parse(textoBody);
    } catch {
        request.body = null;
        request.jsonInvalido = true;
    }
}
