import { buildRoutePath } from './utils/build-route-path.js';
import { db } from './database.js';
import { createTask, updateTask, deleteTask } from './funcoes.js';

export const routes = [
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: async (request, response) => {
            const { titulo, descricao } = request.body ?? {};
            if (typeof titulo !== 'string' || !titulo.trim() || typeof descricao !== 'string' || !descricao.trim())
                return response.writeHead(400).end(JSON.stringify({ erro: "titulo e descricao devem ser textos não vazios" }));
            await createTask(titulo, descricao);
            return response.writeHead(201).end(JSON.stringify("Tarefa criada!"));
        }
    },
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: async (request, response) => {
            const pesquisa = request.query.search;
            let tarefasFiltradas = db.tarefas;
            
            if (pesquisa) {
                tarefasFiltradas = db.tarefas.filter(tarefa => {
                    return tarefa.titulo.toLowerCase().includes(pesquisa.toLowerCase()) || 
                           tarefa.descricao.toLowerCase().includes(pesquisa.toLowerCase());
                });
            }
            return response.writeHead(200).end(JSON.stringify(tarefasFiltradas));
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: async (request, response) => {
            const id = Number(request.params.id);
            const sucesso = await deleteTask(id);
            if (sucesso) return response.writeHead(200).end(JSON.stringify("Deletado com sucesso!"));
            return response.writeHead(404).end(JSON.stringify("Não encontrado"));
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: async (request, response) => {
            const id = Number(request.params.id);
            const dados = request.body;
            if (!dados || typeof dados !== 'object' || Array.isArray(dados) || Object.keys(dados).length === 0 ||
                Object.entries(dados).some(([chave, valor]) => !['titulo', 'descricao', 'status'].includes(chave) || typeof valor !== 'string' || !valor.trim()))
                return response.writeHead(400).end(JSON.stringify({ erro: "Corpo inválido; envie campos de tarefa como textos não vazios" }));
            const sucesso = await updateTask(id, dados);
            if (sucesso) return response.writeHead(200).end(JSON.stringify("Atualizado via PUT!"));
            return response.writeHead(404).end(JSON.stringify("Não encontrado"));
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: async (request, response) => {
            if (request.body !== undefined && (!request.body || typeof request.body !== 'object' || Array.isArray(request.body)))
                return response.writeHead(400).end(JSON.stringify({ erro: "O corpo deve ser um objeto JSON" }));
            const id = Number(request.params.id);
            const sucesso = await updateTask(id, { status: "CONCLUÍDO!" });
            if (sucesso) return response.writeHead(200).end(JSON.stringify("Concluído via PATCH!"));
            return response.writeHead(404).end(JSON.stringify("Não encontrado"));
        }
    }
];
