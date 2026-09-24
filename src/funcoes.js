import { db, salvarBanco } from './database.js';

export async function createTask(titulo, descricao) {
    const novaTarefa = {
        id: db.proxId,
        titulo,
        descricao,
        status: "Pendente..."
    };
    db.tarefas.push(novaTarefa);
    db.proxId++;
    await salvarBanco();
    return novaTarefa;
}

export function listTasks() {
    if (db.tarefas.length === 0) {
        console.log("Nenhuma tarefa cadastrada!");
        return;
    }
    console.log(db.tarefas);
}

export async function updateTask(id, novosDados) {
    const index = db.tarefas.findIndex(tarefa => tarefa.id === id);
    if (index === -1) {
        console.log("Tarefa não encontrada");
        return false;
    }
    db.tarefas[index] = { ...db.tarefas[index], ...novosDados };
    await salvarBanco();
    return true;
}

export async function deleteTask(id) {
    const index = db.tarefas.findIndex(tarefa => tarefa.id === id);
    if (index === -1) {
        console.log("Tarefa não encontrada");
        return false;
    }
    db.tarefas.splice(index, 1);
    await salvarBanco();
    return true;
}
