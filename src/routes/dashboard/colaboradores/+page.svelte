<script>
    import { onMount } from 'svelte';
    
    let colaboradores = [];
    let unidades = [];
    let isLoading = true;
    let novoColaboradorNome = '';

    // Funções de busca (simulação)
    async function fetchUnidades() {
        console.log("TODO: Buscar unidades do banco de dados");
        return [
            { id: 'un-1', nome_unidade: 'Matriz' },
            { id: 'un-2', nome_unidade: 'Filial Centro' }
        ];
    }

    async function fetchColaboradores() {
        isLoading = true;
        console.log("TODO: Buscar colaboradores e suas unidades associadas");
        colaboradores = [
            { id: 'col-1', nome_colaborador: 'João da Silva', ativo: true, unidades: [{nome_unidade: 'Matriz'}] },
            { id: 'col-2', nome_colaborador: 'Maria Oliveira', ativo: false, unidades: [{nome_unidade: 'Matriz'}, {nome_unidade: 'Filial Centro'}] }
        ];
        isLoading = false;
    }

    async function handleAddColaborador() {
        const checkboxes = document.querySelectorAll('#colaboradorUnidadesCheckboxContainer input:checked');
        const selectedUnidades = Array.from(checkboxes).map(cb => cb.value);

        if (!novoColaboradorNome.trim()) {
            alert('O nome do colaborador é obrigatório.');
            return;
        }
        if (selectedUnidades.length === 0) {
            alert('Selecione pelo menos uma unidade para o colaborador.');
            return;
        }

        console.log("TODO: Salvar colaborador no banco:", { nome: novoColaboradorNome, unidades: selectedUnidades });
        
        novoColaboradorNome = '';
        checkboxes.forEach(cb => cb.checked = false);
        await fetchColaboradores();
    }

    async function handleToggleAtivo(colaborador) {
        const novoStatus = !colaborador.ativo;
        if (!confirm(`Tem certeza que deseja ${novoStatus ? 'ATIVAR' : 'DESATIVAR'} este colaborador?`)) return;
        console.log(`TODO: Atualizar status do colaborador ${colaborador.id} para ${novoStatus}`);
        await fetchColaboradores();
    }

    async function handleDeleteColaborador(colaboradorId) {
        if (!confirm('Tem certeza que deseja excluir este colaborador?')) return;
        console.log("TODO: Deletar colaborador do banco:", colaboradorId);
        await fetchColaboradores();
    }

    onMount(async () => {
        unidades = await fetchUnidades();
        await fetchColaboradores();
    });
</script>

<div class="page-container">
    <a href="/dashboard" class="back-button">&larr; Voltar ao Painel</a>
    <h2>Gerenciar Colaboradores</h2>

    <div class="card">
        <div class="card-header"><h3>Adicionar Novo Colaborador</h3></div>
        <div class="card-body">
            <form on:submit|preventDefault={handleAddColaborador}>
                <div class="form-group">
                    <label for="colaboradorNome">Nome do Colaborador:</label>
                    <input type="text" id="colaboradorNome" bind:value={novoColaboradorNome} placeholder="Nome completo">
                </div>
                <div class="form-group">
                    <label>Associar às Unidades:</label>
                    <div id="colaboradorUnidadesCheckboxContainer" class="checkbox-group-container">
                        {#if unidades.length > 0}
                            {#each unidades as unidade (unidade.id)}
                                <div class="checkbox-item">
                                    <input type="checkbox" id="unidade_colab_{unidade.id}" value={unidade.id}>
                                    <label for="unidade_colab_{unidade.id}">{unidade.nome_unidade}</label>
                                </div>
                            {/each}
                        {:else}
                             <p class="text-muted">Nenhuma unidade cadastrada.</p>
                        {/if}
                    </div>
                </div>
                <button type="submit" class="btn btn-success">Adicionar Colaborador</button>
            </form>
        </div>
    </div>

    <div class="card">
        <div class="card-header"><h3>Colaboradores Cadastrados</h3></div>
        <div class="card-body" style="padding:0; overflow-x: auto;">
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Ativo</th>
                        <th>Unidades</th>
                        <th class="actions-column">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {#if isLoading}
                        <tr><td colspan="4" class="centered-cell">Carregando...</td></tr>
                    {:else if colaboradores.length === 0}
                        <tr><td colspan="4" class="centered-cell">Nenhum colaborador cadastrado.</td></tr>
                    {:else}
                        {#each colaboradores as col (col.id)}
                            <tr>
                                <td>{col.nome_colaborador}</td>
                                <td>{col.ativo ? 'Sim' : 'Não'}</td>
                                <td>{col.unidades.map(u => u.nome_unidade).join(', ')}</td>
                                <td class="actions-column">
                                    <button on:click={() => handleToggleAtivo(col)} class="btn {col.ativo ? 'btn-warning' : 'btn-success'}">
                                        {col.ativo ? 'Desativar' : 'Ativar'}
                                    </button>
                                    <button on:click={() => handleDeleteColaborador(col.id)} class="btn btn-danger">Excluir</button>
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
    .page-container { width: 100%; max-width: 900px; margin: auto; }
    .back-button { display: inline-block; margin-bottom: 1.5rem; font-weight: 500; color: var(--primary-color, #0052cc); text-decoration: none; }
    .back-button:hover { text-decoration: underline; }
    .card { background-color: #fff; border: 1px solid #dee2e6; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 1.5rem; }
    .card-header { padding: 1rem 1.5rem; border-bottom: 1px solid #dee2e6; }
    .card-header h3 { margin: 0; font-size: 1.25rem; }
    .card-body { padding: 1.5rem; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    input[type="text"] { width: 100%; padding: 0.6rem 0.85rem; border: 1px solid #dee2e6; border-radius: 0.5rem; box-sizing: border-box; }
    .checkbox-group-container { max-height: 150px; overflow-y: auto; border: 1px solid #dee2e6; padding: 1rem; border-radius: 0.5rem; background-color: #f8f9fa; }
    .checkbox-item { display: flex; align-items: center; margin-bottom: 0.5rem; }
    .checkbox-item input { width: auto; margin-right: 0.75rem; }
    .checkbox-item label { margin: 0; font-weight: normal; }
    .btn { padding: 0.6rem 1.2rem; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 500; color: white; margin: 0 0.25rem; }
    .btn-success { background-color: #1a8754; }
    .btn-warning { background-color: #fbbc05; color: black; }
    .btn-danger { background-color: #d93025; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 0.85rem 1rem; border-bottom: 1px solid #dee2e6; }
    th { background-color: #f8f9fa; font-weight: 600; }
    .actions-column { text-align: center; width: 220px; }
    .centered-cell { text-align: center; padding: 2rem; color: #606770; }
</style>