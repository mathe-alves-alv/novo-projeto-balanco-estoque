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
                        {#each unidades as unidade (unidade.id)}
                            <div class="checkbox-item">
                                <input type="checkbox" id="unidade_colab_{unidade.id}" value={unidade.id}>
                                <label for="unidade_colab_{unidade.id}">{unidade.nome_unidade}</label>
                            </div>
                        {/each}
                    </div>
                </div>
                <button type="submit" class="btn-success">Adicionar Colaborador</button>
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
                        <th style="width: 220px;">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {#if isLoading}
                        <tr><td colspan="4" style="text-align: center;">Carregando...</td></tr>
                    {:else if colaboradores.length === 0}
                        <tr><td colspan="4" style="text-align: center;">Nenhum colaborador cadastrado.</td></tr>
                    {:else}
                        {#each colaboradores as col (col.id)}
                            <tr>
                                <td>{col.nome_colaborador}</td>
                                <td>{col.ativo ? 'Sim' : 'Não'}</td>
                                <td>{col.unidades.map(u => u.nome_unidade).join(', ')}</td>
                                <td style="text-align: center;">
                                    <button on:click={() => handleToggleAtivo(col)} class="btn {col.ativo ? 'btn-warning' : 'btn-success'} table-actions">
                                        {col.ativo ? 'Desativar' : 'Ativar'}
                                    </button>
                                    <button on:click={() => handleDeleteColaborador(col.id)} class="btn-danger table-actions">Excluir</button>
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
</style>