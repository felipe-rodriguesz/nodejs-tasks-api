# Node.js Tasks API

API REST para criação, consulta, atualização e remoção de tarefas, implementada com módulos nativos do Node.js, sem frameworks.

As tarefas são persistidas localmente no arquivo `db.json`. Esse arquivo JSON é uma persistência simples para demonstração e não é um banco de dados convencional.

## Requisitos e execução

É necessário ter Node.js instalado. O projeto usa apenas módulos nativos e não possui dependências externas; não é necessário executar `npm install`.

```bash
git clone https://github.com/felipe-rodriguesz/nodejs-tasks-api.git
cd nodejs-tasks-api
npm start
```

A API ficará disponível em `http://localhost:3000`. Também pode ser iniciada com `node src/server.js`. As requisições da coleção `insomnia.json` podem ser importadas no Insomnia.

## Funcionalidades e rotas

| Método | Rota | Descrição | Corpo |
|---|---|---|---|
| `GET` | `/tasks` | Lista tarefas | Nenhum |
| `GET` | `/tasks?search=Node` | Filtra por título ou descrição, sem diferenciar maiúsculas/minúsculas | Nenhum |
| `POST` | `/tasks` | Cria tarefa com status inicial pendente | `titulo` e `descricao` como textos não vazios |
| `PUT` | `/tasks/:id` | Atualiza/mescla os campos enviados na tarefa existente | Um ou mais entre `titulo`, `descricao` e `status`, como textos não vazios |
| `PATCH` | `/tasks/:id/complete` | Marca a tarefa como concluída | Nenhum |
| `DELETE` | `/tasks/:id` | Remove a tarefa | Nenhum |

O `PUT` aplica os campos recebidos sobre a tarefa existente; os campos omitidos são preservados. Por exemplo, enviar apenas `{"titulo":"Novo título"}` altera somente o título.

### Códigos HTTP

- `200 OK`: consulta, atualização, conclusão ou exclusão concluída.
- `201 Created`: tarefa criada.
- `400 Bad Request`: JSON malformado ou corpo inválido para criação/atualização.
- `404 Not Found`: rota ou tarefa inexistente.
- `500 Internal Server Error`: falha ao processar a requisição ou gravar a persistência local.

Erros são retornados em JSON com uma mensagem clara. Falhas internas são registradas no console, sem expor detalhes ou stack traces na resposta HTTP.

## Exemplos

Criar tarefa:

```json
{
  "titulo": "Estudar Node.js",
  "descricao": "Revisar os módulos HTTP e File System"
}
```

Buscar tarefas que contenham `Node` no título ou na descrição: `GET /tasks?search=Node`.

Corpos de criação precisam incluir `titulo` e `descricao` como textos não vazios. Corpos de atualização precisam ser objetos JSON não vazios contendo campos permitidos como textos não vazios. JSON inválido e dados inválidos recebem `400 Bad Request`.
