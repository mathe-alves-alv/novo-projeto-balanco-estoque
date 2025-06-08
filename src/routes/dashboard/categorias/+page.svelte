<script>
    import { onMount } from 'svelte';
    import { user } from '$lib/sessionStore';
    import { supabase } from '$lib/supabaseClient';

    let categorias = [];
    let nomeNovaCategoria = '';
    let isLoading = true;

    // --- VERSÃO FINAL ---
    // Busca as categorias reais da empresa logada no banco de dados.
    async function fetchCategorias() {
        isLoading = true;
        const empresaId = $user?.user_metadata?.empresa_id;
        
        if (!empresaId) {
            console.error("ID da empresa não encontrado no usuário logado para buscar categorias.");
            isLoading = false;
            return;
        }
        
        const { data, error } = await supabase
            .from('categorias')
            .select('id, nome_categoria, created_at')
            .eq('empresa_id', empresaId)
            .order('nome_categoria');

        if (error) {
            console.error("Erro ao buscar categorias:", error);
            alert("Não foi possível carregar as categorias.");
        } else {
            categorias = data;
        }
        isLoading = false;
    }

    // --- VERSÃO FINAL ---
    // Adiciona uma nova categoria no banco de dados.
    async function handleAddCategoria() {
        if (!nomeNovaCategoria.trim()) {
            alert('O nome da categoria é obrigatório.');
            return;
        }
        const empresaId = $user?.user_metadata?.empresa_id;
        if (!empresaId) {
            alert('ID da empresa não encontrado para adicionar categoria.');
            return;
        }

        const { error } = await supabase
            .from('categorias')
            .insert([{ nome_categoria: nomeNovaCategoria, empresa_id: empresaId }]);

        if (error) {
            console.error('Erro ao adicionar categoria:', error);
            alert('Erro ao adicionar categoria. Verifique se o nome já existe.');
        } else {
            nomeNovaCategoria = ''; // Limpa o campo
            await fetchCategorias(); // Recarrega a lista da tabela
        }
    }

    // --- VERSÃO FINAL ---
    // Deleta uma categoria do banco de dados.
    async function handleDeleteCategoria(categoriaId) {
        // TODO: Adicionar verificação se a categoria está em uso por algum produto antes de deletar.
        if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;

        const { error } = await supabase
            .from('categorias')
            .delete()
            .eq('id', categoriaId);

        if (error) {
            console.error('Erro ao excluir categoria:', error);
            alert('Erro ao excluir a categoria.');
        } else {
            await fetchCategorias(); // Recarrega a lista da tabela
        }
    }

    onMount(fetchCategorias);
</script>

<div class="page-container">
    <a href="/dashboard" class="back-button">&larr; Voltar ao Painel</a>
    <h2>Gerenciar Categorias</h2>

    <div class="card">
        <div class="card-header"><h3>Adicionar Nova Categoria</h3></div>
        <div class="card-body">
            <form on:submit|preventDefault={handleAddCategoria}>
                <div class="form-group">
                    <label for="nomeCategoriaInput">Nome da Categoria:</label>
                    <input type="text" id="nomeCategoriaInput" bind:value={nomeNovaCategoria} placeholder="Ex: Frios, Laticínios, etc.">
                </div>
                <button type="submit" class="btn btn-success">Adicionar Categoria</button>
            </form>
        </div>
    </div>

    <div class="card">
        <div class="card-header"><h3>Categorias Cadastradas</h3></div>
        <div class="card-body" style="padding:0;">
            <table>
                <thead>
                    <tr>
                        <th>Nome da Categoria</th>
                        <th>Criação</th>
                        <th class="actions-column">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {#if isLoading}
                        <tr><td colspan="3" class="centered-cell">Carregando...</td></tr>
                    {:else if categorias.length === 0}
                        <tr><td colspan="3" class="centered-cell">Nenhuma categoria cadastrada.</td></tr>
                    {:else}
                        {#each categorias as categoria (categoria.id)}
                            <tr>
                                <td>{categoria.nome_categoria}</td>
                                <td>{new Date(categoria.created_at).toLocaleDateString('pt-BR')}</td>
                                <td class="actions-column">
                                    <button on:click={() => handleDeleteCategoria(categoria.id)} class="btn btn-danger">Excluir</button>
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
    .page-container { width: 100%; max-width: 900px; margin: auto; }
    .back-button { display: inline-block; margin-bottom: 1.5rem; font-weight: 500; color: var(--primary-color); text-decoration: none; }
    .back-button:hover { text-decoration: underline; }
    .card { background-color: var(--card-bg-color); border: 1px solid var(--border-color); border-radius: var(--border-radius); box-shadow: var(--box-shadow); margin-bottom: 1.5rem; }
    .card-header { padding: 1rem 1.5rem; border-bottom: 1px solid var(--border-color); }
    .card-header h3 { margin: 0; font-size: 1.25rem; }
    .card-body { padding: 1.5rem; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    input[type="text"] { width: 100%; padding: 0.6rem 0.85rem; border: 1px solid var(--border-color); border-radius: var(--border-radius); box-sizing: border-box; }
    .btn { padding: 0.6rem 1.2rem; border: none; border-radius: var(--border-radius); cursor: pointer; font-weight: 500; color: white; }
    .btn-success { background-color: var(--success-color); }
    .btn-danger { background-color: var(--danger-color); }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 0.85rem 1rem; border-bottom: 1px solid var(--border-color); }
    th { background-color: #f8f9fa; font-weight: 600; }
    .actions-column { text-align: center; width: 120px; }
    .centered-cell { text-align: center; padding: 2rem; color: #606770; }
</style>