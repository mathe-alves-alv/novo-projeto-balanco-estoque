<script>
    import { onMount, tick } from 'svelte';
    import { user } from '$lib/sessionStore';
    import { derived, writable } from 'svelte/store';

    // --- Estado da Página ---
    let unidades = [];
    let colaboradores = [];
    let produtos = [];
    let categorias = [];
    
    let selectedUnidadeId = '';
    let selectedColaboradorId = '';
    let quantidades = {}; // Objeto para armazenar as quantidades digitadas

    // --- Estado dos Filtros ---
    let filtroCodigo = '';
    let filtroNome = '';
    let filtroCategoria = '';

    // --- Funções de Busca (Simulação) ---
    async function fetchUnidades() {
        console.log("TODO: Buscar unidades do banco");
        return [{ id: 'un-1', nome_unidade: 'Matriz' }, { id: 'un-2', nome_unidade: 'Filial Centro' }];
    }
    async function fetchColaboradores(unidadeId) {
        console.log("TODO: Buscar colaboradores da unidade", unidadeId);
        return [{ id: 'col-1', nome_colaborador: 'João da Silva' }, { id: 'col-2', nome_colaborador: 'Maria Oliveira' }];
    }
    async function fetchProdutos(empresaId) {
        console.log("TODO: Buscar produtos da empresa", empresaId);
        return [
            { id: 'prod-1', codigo_produto: '001', nome_produto: 'Pão Francês', categorias: [{id: 'cat-1'}] },
            { id: 'prod-2', codigo_produto: '002', nome_produto: 'Pão de Queijo', categorias: [{id: 'cat-1'}] },
            { id: 'prod-3', codigo_produto: '101', nome_produto: 'Coca-Cola 2L', categorias: [{id: 'cat-2'}] }
        ];
    }
    async function fetchCategorias(empresaId) {
        console.log("TODO: Buscar categorias da empresa", empresaId);
        return [{id: 'cat-1', nome_categoria: 'Padaria'}, {id: 'cat-2', nome_categoria: 'Bebidas'}];
    }

    // --- Lógica da Página ---
    async function handleUnitSelection() {
        if (selectedUnidadeId) {
            colaboradores = await fetchColaboradores(selectedUnidadeId);
            produtos = await fetchProdutos($user.empresa_id);
            categorias = await fetchCategorias($user.empresa_id);
        } else {
            colaboradores = [];
            produtos = [];
            categorias = [];
        }
    }
    
    function handleClearQuantities() {
        if (!confirm('Tem certeza que deseja limpar todas as quantidades digitadas?')) return;
        quantidades = {};
    }
    
    // --- LÓGICA DE FILTRAGEM REATIVA ---
    const produtosFiltrados = derived(
        [writable(produtos), writable(filtroCodigo), writable(filtroNome), writable(filtroCategoria)],
        ([$produtos, $filtroCodigo, $filtroNome, $filtroCategoria]) => {
            if (!$produtos) return [];
            return $produtos.filter(p => {
                const matchCodigo = p.codigo_produto.toLowerCase().includes($filtroCodigo.toLowerCase());
                const matchNome = p.nome_produto.toLowerCase().includes($filtroNome.toLowerCase());
                const matchCategoria = !$filtroCategoria || p.categorias.some(c => c.id === $filtroCategoria);
                return matchCodigo && matchNome && matchCategoria;
            });
        }
    );


    onMount(async () => {
        unidades = await fetchUnidades();
    });
</script>

<div class="page-container">
    <a href="/dashboard" class="back-button">&larr; Voltar ao Painel</a>
    <h2>Nova Contagem de Estoque</h2>

    <div class="card">
        <div class="card-body">
            <div class="form-group">
                <label for="selectUnidadeContagem">Passo 1: Selecione a Unidade</label>
                <select id="selectUnidadeContagem" bind:value={selectedUnidadeId} on:change={handleUnitSelection}>
                    <option value="">-- Selecione --</option>
                    {#each unidades as unidade (unidade.id)}
                        <option value={unidade.id}>{unidade.nome_unidade}</option>
                    {/each}
                </select>
            </div>
        </div>
    </div>

    {#if selectedUnidadeId}
        <div class="card">
            <div class="card-body">
                <div class="form-group">
                    <label for="selectColaboradorContagem">Passo 2: Contagem realizada por</label>
                    <select id="selectColaboradorContagem" bind:value={selectedColaboradorId}>
                        <option value="">-- Selecione o colaborador --</option>
                        {#each colaboradores as col (col.id)}
                            <option value={col.id}>{col.nome_colaborador}</option>
                        {/each}
                    </select>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header"><h3>Filtros</h3></div>
            <div class="card-body filter-grid">
                <div class="form-group"><label for="filtroCodigo">Filtrar por Código:</label><input type="text" id="filtroCodigo" bind:value={filtroCodigo}></div>
                <div class="form-group"><label for="filtroNome">Filtrar por Nome:</label><input type="text" id="filtroNome" bind:value={filtroNome}></div>
                <div class="form-group"><label for="filtroCategoria">Filtrar por Categoria:</label>
                    <select id="filtroCategoria" bind:value={filtroCategoria}>
                        <option value="">Todas</option>
                        {#each categorias as cat (cat.id)}
                            <option value={cat.id}>{cat.nome_categoria}</option>
                        {/each}
                    </select>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header"><h3>Lista de Produtos</h3></div>
            <div class="card-body" style="padding:0;">
                <table>
                    <thead><tr><th>Código</th><th>Produto</th><th>Quantidade</th></tr></thead>
                    <tbody>
                        {#each $produtosFiltrados as produto (produto.id)}
                            <tr>
                                <td>{produto.codigo_produto}</td>
                                <td>{produto.nome_produto}</td>
                                <td><input type="number" min="0" class="qty-input" bind:value={quantidades[produto.id]}></td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
            <div class="card-footer">
                <button class="btn btn-danger" on:click={handleClearQuantities}>Limpar Quantidades</button>
                <button class="btn btn-success">Gerar Relatórios e Salvar</button>
            </div>
        </div>
    {/if}
</div>

<style>
    .page-container { width: 100%; max-width: 900px; margin: auto; }
    .back-button { display: inline-block; margin-bottom: 1.5rem; font-weight: 500; color: var(--primary-color, #0052cc); text-decoration: none; }
    .card { background-color: #fff; border: 1px solid #dee2e6; border-radius: 0.5rem; margin-bottom: 1.5rem; }
    .card-header { padding: 1rem 1.5rem; border-bottom: 1px solid #dee2e6; }
    .card-header h3 { margin: 0; font-size: 1.25rem; }
    .card-body { padding: 1.5rem; }
    .card-footer { padding: 1rem 1.5rem; border-top: 1px solid #dee2e6; text-align: right; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    input, select { width: 100%; padding: 0.6rem 0.85rem; border: 1px solid #dee2e6; border-radius: 0.5rem; box-sizing: border-box; }
    .filter-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
    .qty-input { max-width: 100px; text-align: right; }
    .btn { padding: 0.6rem 1.2rem; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 500; color: white; }
    .btn-success { background-color: #1a8754; }
    .btn-danger { background-color: #d93025; }
</style>