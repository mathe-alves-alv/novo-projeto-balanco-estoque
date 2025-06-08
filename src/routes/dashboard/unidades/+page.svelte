<script>
    import { onMount } from 'svelte';
    // A lógica JavaScript permanece a mesma, focamos apenas na aparência.
    
    let unidades = [];
    let nomeNovaUnidade = '';
    let isLoading = true;

    async function fetchUnidades() {
        isLoading = true;
        console.log("TODO: Buscar unidades do banco de dados");
        unidades = [
            { id: '123', nome_unidade: 'Matriz (Exemplo)', created_at: new Date().toISOString() },
            { id: '456', nome_unidade: 'Filial Shopping (Exemplo)', created_at: new Date().toISOString() }
        ];
        isLoading = false;
    }

    async function handleAddUnidade() {
        if (!nomeNovaUnidade.trim()) return alert('O nome da unidade é obrigatório.');
        console.log("TODO: Salvar a nova unidade:", nomeNovaUnidade);
        nomeNovaUnidade = '';
        await fetchUnidades();
    }
    
    async function handleDeleteUnidade(unidadeId) {
        if (!confirm('Tem certeza?')) return;
        console.log("TODO: Deletar a unidade:", unidadeId);
        await fetchUnidades();
    }

    onMount(fetchUnidades);
</script>

<div class="page-container">
    <a href="/dashboard" class="back-button">&larr; Voltar ao Painel</a>
    <h2>Gerenciar Unidades</h2>

    <div class="card">
        <div class="card-header">
            <h3>Adicionar Nova Unidade</h3>
        </div>
        <div class="card-body">
            <form on:submit|preventDefault={handleAddUnidade}>
                <div class="form-group">
                    <label for="unidadeNomeInput">Nome da Unidade:</label>
                    <input type="text" id="unidadeNomeInput" bind:value={nomeNovaUnidade} placeholder="Ex: Matriz, Filial Centro">
                </div>
                <button type="submit" class="btn btn-success">Adicionar</button>
            </form>
        </div>
    </div>

    <div class="card">
        <div class="card-header">
            <h3>Unidades Cadastradas</h3>
        </div>
        <div class="card-body">
            <table>
                <thead>
                    <tr>
                        <th>Nome da Unidade</th>
                        <th>Criação</th>
                        <th class="actions-column">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {#if isLoading}
                        <tr><td colspan="3" class="centered-cell">Carregando...</td></tr>
                    {:else if unidades.length === 0}
                        <tr><td colspan="3" class="centered-cell">Nenhuma unidade cadastrada.</td></tr>
                    {:else}
                        {#each unidades as unidade (unidade.id)}
                            <tr>
                                <td>{unidade.nome_unidade}</td>
                                <td>{new Date(unidade.created_at).toLocaleDateString('pt-BR')}</td>
                                <td class="actions-column">
                                    <button on:click={() => handleDeleteUnidade(unidade.id)} class="btn btn-danger">Excluir</button>
                                </td>
                            </tr>
                        {/each}
                    {/if}
                </tbody>
            </table>
        </div>
    </div>
</div>

<style>
    /* As variáveis de cor vêm de um arquivo global ou podem ser definidas aqui */
    :root {
        --primary-color: #0052cc;
        --danger-color: #d93025;
        --success-color: #1a8754;
        --border-color: #dee2e6;
        --card-bg-color: #ffffff;
        --text-color: #1c1e21;
        --border-radius: 0.5rem;
        --box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .page-container {
        width: 100%;
        max-width: 900px;
        margin: auto;
    }
    .back-button {
        display: inline-block;
        margin-bottom: 1.5rem;
        font-weight: 500;
        color: var(--primary-color);
        text-decoration: none;
    }
    .back-button:hover {
        text-decoration: underline;
    }
    .card {
        background-color: var(--card-bg-color);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        box-shadow: var(--box-shadow);
        margin-bottom: 1.5rem;
    }
    .card-header {
        padding: 1rem 1.5rem;
        border-bottom: 1px solid var(--border-color);
    }
    .card-header h3 {
        margin: 0;
        font-size: 1.25rem;
    }
    .card-body {
        padding: 1.5rem;
    }
    .form-group {
        margin-bottom: 1rem;
    }
    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
    }
    input[type="text"] {
        width: 100%;
        padding: 0.6rem 0.85rem;
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        box-sizing: border-box;
    }
    .btn {
        padding: 0.6rem 1.2rem;
        border: 1px solid transparent;
        border-radius: var(--border-radius);
        cursor: pointer;
        font-weight: 500;
        color: white;
    }
    .btn-success { background-color: var(--success-color); }
    .btn-danger { background-color: var(--danger-color); }

    table {
        width: 100%;
        border-collapse: collapse;
    }
    th, td {
        text-align: left;
        padding: 0.85rem 1rem;
        border-bottom: 1px solid var(--border-color);
    }
    th {
        background-color: #f8f9fa;
        font-weight: 600;
    }
    .actions-column {
        text-align: center;
        width: 120px;
    }
    .centered-cell {
        text-align: center;
        padding: 2rem;
        color: #606770;
    }
</style>