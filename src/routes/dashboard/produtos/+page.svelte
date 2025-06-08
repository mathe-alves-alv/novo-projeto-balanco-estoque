<script>
    import { onMount } from 'svelte';
    
    let produtos = [];
    let categorias = [];
    let isLoading = true;
    let prodCodigo = '';
    let prodNome = '';
    let importFile;

    async function fetchCategorias() {
        console.log("TODO: Buscar categorias do banco de dados");
        return [
            { id: 'cat-1', nome_categoria: 'Salgados' },
            { id: 'cat-2', nome_categoria: 'Doces' },
            { id: 'cat-3', nome_categoria: 'Bebidas' },
        ];
    }
    
    async function fetchProdutos() {
        isLoading = true;
        console.log("TODO: Buscar produtos do banco");
        produtos = [
            { id: 'prod-1', codigo_produto: '001', nome_produto: 'Coxinha de Frango', categorias: [{nome_categoria: 'Salgados'}] },
            { id: 'prod-2', codigo_produto: '101', nome_produto: 'Croissant', categorias: [{nome_categoria: 'Salgados'}]}
        ];
        isLoading = false;
    }

    async function handleAddProduct() {
        // Lógica permanece a mesma
    }
    
    async function handleFileImport() {
        // Lógica permanece a mesma
    }

    onMount(async () => {
        categorias = await fetchCategorias();
        await fetchProdutos();
    });
</script>

<div class="page-container">
    <a href="/dashboard" class="back-button">&larr; Voltar ao Painel</a>
    <h2>Gerenciar Produtos</h2>

    <div class="card">
        <div class="card-header"><h3>Adicionar Novo Produto</h3></div>
        <div class="card-body">
            <form on:submit|preventDefault={handleAddProduct}>
                <div class="form-group"><label for="prodCodigo">Código:</label><input type="text" id="prodCodigo" bind:value={prodCodigo}></div>
                <div class="form-group"><label for="prodNome">Nome do Produto:</label><input type="text" id="prodNome" bind:value={prodNome}></div>
                <div class="form-group"><label>Categorias:</label>
                    <div id="prodCategoriasCheckboxContainer" class="checkbox-group-container">
                        {#each categorias as categoria (categoria.id)}
                            <div class="checkbox-item">
                                <input type="checkbox" id="cat_{categoria.id}" value={categoria.id}><label for="cat_{categoria.id}">{categoria.nome_categoria}</label>
                            </div>
                        {/each}
                    </div>
                </div>
                <button type="submit" class="btn btn-success">Adicionar Produto</button>
            </form>
        </div>
    </div>
    
    <div class="card">
        <div class="card-header"><h3>Importar Produtos em Massa</h3></div>
        <div class="card-body">
            <div class="form-group">
                <label for="fileInput">Arquivo (.xlsx ou .csv)</label>
                <input type="file" id="fileInput" bind:files={importFile} accept=".xlsx, .xls, .csv">
                <p class="text-muted">
                    Colunas: <strong>codigo</strong>, <strong>produto</strong>, <strong>categorias</strong> (separadas por vírgula).
                </p>
            </div>
            <button on:click={handleFileImport} class="btn btn-primary">Importar Arquivo</button>
        </div>
    </div>

    <div class="card">
        <div class="card-header"><h3>Produtos Cadastrados</h3></div>
        <div class="card-body">
            <table>
                <thead><tr><th>Código</th><th>Produto</th><th>Categorias</th><th class="actions-column">Ação</th></tr></thead>
                <tbody>
                    {#if isLoading}
                        <tr><td colspan="4" class="centered-cell">Carregando...</td></tr>
                    {:else if produtos.length === 0}
                        <tr><td colspan="4" class="centered-cell">Nenhum produto cadastrado.</td></tr>
                    {:else}
                        {#each produtos as produto (produto.id)}
                            <tr>
                                <td>{produto.codigo_produto}</td>
                                <td>{produto.nome_produto}</td>
                                <td>{produto.categorias.map(c => c.nome_categoria).join(', ')}</td>
                                <td class="actions-column"><button class="btn btn-danger">Excluir</button></td>
                            </tr>
                        {/each}
                    {/if}
                </tbody>
            </table>
        </div>
    </div>
</div>

<style>
    /* Copiando o mesmo padrão de estilo da tela de Unidades para manter a consistência */
    .page-container { width: 100%; max-width: 900px; margin: auto; }
    .back-button { display: inline-block; margin-bottom: 1.5rem; font-weight: 500; color: var(--primary-color, #0052cc); text-decoration: none; }
    .back-button:hover { text-decoration: underline; }
    .card { background-color: #fff; border: 1px solid #dee2e6; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 1.5rem; }
    .card-header { padding: 1rem 1.5rem; border-bottom: 1px solid #dee2e6; }
    .card-header h3 { margin: 0; font-size: 1.25rem; }
    .card-body { padding: 1.5rem; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    input[type="text"], input[type="file"] { width: 100%; padding: 0.6rem 0.85rem; border: 1px solid #dee2e6; border-radius: 0.5rem; box-sizing: border-box; }
    .checkbox-group-container { max-height: 150px; overflow-y: auto; border: 1px solid #dee2e6; padding: 1rem; border-radius: 0.5rem; background-color: #f8f9fa; }
    .checkbox-item { display: flex; align-items: center; margin-bottom: 0.5rem; }
    .checkbox-item input { width: auto; margin-right: 0.75rem; }
    .checkbox-item label { margin: 0; font-weight: normal; }
    .text-muted { font-size: 0.85rem; color: #606770; margin-top: 0.5rem; }
    .btn { padding: 0.6rem 1.2rem; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 500; color: white; }
    .btn-success { background-color: #1a8754; }
    .btn-primary { background-color: #0052cc; }
    .btn-danger { background-color: #d93025; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 0.85rem 1rem; border-bottom: 1px solid #dee2e6; }
    th { background-color: #f8f9fa; font-weight: 600; }
    .actions-column { text-align: center; width: 120px; }
    .centered-cell { text-align: center; padding: 2rem; color: #606770; }
</style>