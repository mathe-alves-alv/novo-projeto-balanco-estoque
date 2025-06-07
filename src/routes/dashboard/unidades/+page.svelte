<script>
    import { onMount } from 'svelte';
    
    let unidades = []; // A lista de unidades virá aqui
    let nomeNovaUnidade = '';
    let isLoading = true;

    async function fetchUnidades() {
        isLoading = true;
        console.log("TODO: Buscar unidades do banco de dados");
        // Por enquanto, usamos dados de simulação
        unidades = [
            { id: '123', nome_unidade: 'Matriz (Exemplo)', created_at: new Date().toISOString() },
            { id: '456', nome_unidade: 'Filial Shopping (Exemplo)', created_at: new Date().toISOString() }
        ];
        isLoading = false;
    }

    async function handleAddUnidade() {
        if (!nomeNovaUnidade.trim()) {
            alert('O nome da unidade não pode estar em branco.');
            return;
        }
        console.log("TODO: Salvar a nova unidade no banco de dados:", nomeNovaUnidade);
        nomeNovaUnidade = '';
        await fetchUnidades();
    }
    
    async function handleDeleteUnidade(unidadeId) {
        if (!confirm('Tem certeza que deseja excluir esta unidade?')) return;
        console.log("TODO: Deletar a unidade do banco de dados:", unidadeId);
        await fetchUnidades();
    }

    onMount(() => {
        fetchUnidades();
    });
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
                <button type="submit" class="btn-success">Adicionar</button>
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
                        <th style="width: 120px;">Ações</th>
                    </tr>
                </thead>
                <tbody id="unidadesTableBody">
                    {#if isLoading}
                        <tr><td colspan="3" style="text-align: center;">Carregando...</td></tr>
                    {:else if unidades.length === 0}
                        <tr><td colspan="3" style="text-align: center;">Nenhuma unidade cadastrada.</td></tr>
                    {:else}
                        {#each unidades as unidade (unidade.id)}
                            <tr>
                                <td>{unidade.nome_unidade}</td>
                                <td>{new Date(unidade.created_at).toLocaleDateString('pt-BR')}</td>
                                <td style="text-align: center;">
                                    <button on:click={() => handleDeleteUnidade(unidade.id)} class="btn-danger table-actions">Excluir</button>
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
    .page-container {
        width: 100%;
        max-width: 900px;
        margin: auto;
    }
    .back-button {
        display: inline-block;
        margin-bottom: 1.5rem;
        font-weight: 500;
        color: var(--primary-color, #0052cc);
        text-decoration: none;
    }
    .back-button:hover {
        text-decoration: underline;
    }
</style>