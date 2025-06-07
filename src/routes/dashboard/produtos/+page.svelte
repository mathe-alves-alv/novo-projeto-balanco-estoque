<script>
    import { onMount } from 'svelte';
    
    let produtos = [];
    let categorias = [];
    let isLoading = true;
    
    // Variáveis para o formulário
    let prodCodigo = '';
    let prodNome = '';
    let importFile;

    // --- LÓGICA (ainda em simulação) ---

    async function fetchCategorias() {
        console.log("TODO: Buscar categorias do banco de dados");
        return [
            { id: 'cat-1', nome_categoria: 'Salgados' },
            { id: 'cat-2', nome_categoria: 'Doces' },
            { id: 'cat-3', nome_categoria: 'Bebidas' }
        ];
    }
    
    async function fetchProdutos() {
        isLoading = true;
        console.log("TODO: Buscar produtos e suas categorias associadas do banco");
        produtos = [
            { id: 'prod-1', codigo_produto: '001', nome_produto: 'Coxinha de Frango', categorias: [{nome_categoria: 'Salgados'}] },
            { id: 'prod-2', codigo_produto: '002', nome_produto: 'Brigadeiro Gourmet', categorias: [{nome_categoria: 'Doces'}]}
        ];
        isLoading = false;
    }

    async function handleAddProduct() {
        const checkboxes = document.querySelectorAll('#prodCategoriasCheckboxContainer input:checked');
        const selectedCategorias = Array.from(checkboxes).map(cb => cb.value);

        if (!prodCodigo.trim() || !prodNome.trim() || selectedCategorias.length === 0) {
            alert('Todos os campos são obrigatórios, incluindo ao menos uma categoria.');
            return;
        }

        console.log("TODO: Salvar o produto:", { codigo: prodCodigo, nome: prodNome, categorias: selectedCategorias });
        
        prodCodigo = '';
        prodNome = '';
        checkboxes.forEach(cb => cb.checked = false);
        await fetchProdutos();
    }
    
    // --- NOVA FUNÇÃO PARA IMPORTAÇÃO ---
    async function handleFileImport() {
        if (!importFile || importFile.length === 0) {
            alert('Por favor, selecione um arquivo para importar.');
            return;
        }
        
        const file = importFile[0];
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const data = e.target.result;
            // A biblioteca XLSX já está no <head> do seu HTML original
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonProducts = XLSX.utils.sheet_to_json(sheet);

            if (jsonProducts.length === 0) {
                alert('O arquivo parece estar vazio ou em um formato incorreto.');
                return;
            }

            console.log("--- Produtos lidos do arquivo ---");
            console.log(jsonProducts);
            alert(`Foram lidos ${jsonProducts.length} produtos do arquivo. Veja o console (F12) para os detalhes.`);
            
            // TODO: Implementar a lógica de salvar esses dados no banco.
        };
        
        reader.onerror = (e) => {
            console.error("Erro ao ler o arquivo:", e);
            alert("Ocorreu um erro ao tentar ler o arquivo.");
        };

        reader.readAsBinaryString(file);
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
                <div class="form-group"><label>Categorias (selecione uma ou mais):</label>
                    <div id="prodCategoriasCheckboxContainer" class="checkbox-group-container">
                        {#each categorias as categoria (categoria.id)}
                            <div class="checkbox-item">
                                <input type="checkbox" id="cat_{categoria.id}" value={categoria.id}><label for="cat_{categoria.id}">{categoria.nome_categoria}</label>
                            </div>
                        {/each}
                    </div>
                </div>
                <button type="submit" class="btn-success">Adicionar Produto</button>
            </form>
        </div>
    </div>
    
    <div class="card">
        <div class="card-header"><h3>Importar Produtos em Massa</h3></div>
        <div class="card-body">
            <div class="form-group">
                <label for="fileInput">Arquivo (.xlsx ou .csv)</label>
                <input type="file" id="fileInput" bind:files={importFile} accept=".xlsx, .xls, .csv">
                <p class="text-muted-color" style="font-size: 0.85rem; margin-top: 0.5rem;">
                    O arquivo deve ter as colunas: <strong>codigo</strong>, <strong>produto</strong>, <strong>categorias</strong>.<br>
                    Para múltiplas categorias, separe-as por vírgula (Ex: "Salgados, Lanches").
                </p>
            </div>
            <button on:click={handleFileImport} class="btn-primary">Importar Arquivo</button>
        </div>
    </div>

    <div class="card">
        <div class="card-header"><h3>Produtos Cadastrados</h3></div>
        <div class="card-body" style="padding:0; overflow-x: auto;">
            <table>
                <thead><tr><th>Código</th><th>Produto</th><th>Categorias</th><th>Ação</th></tr></thead>
                <tbody>
                    {#if isLoading}
                        <tr><td colspan="4" style="text-align: center;">Carregando...</td></tr>
                    {:else if produtos.length === 0}
                        <tr><td colspan="4" style="text-align: center;">Nenhum produto cadastrado.</td></tr>
                    {:else}
                        {#each produtos as produto (produto.id)}
                            <tr>
                                <td>{produto.codigo_produto}</td>
                                <td>{produto.nome_produto}</td>
                                <td>{produto.categorias.map(c => c.nome_categoria).join(', ')}</td>
                                <td style="text-align: center;"><button class="btn-danger table-actions">Excluir</button></td>
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