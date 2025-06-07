<script>
    import { onMount } from 'svelte';
    import { user } from '$lib/sessionStore';

    // Estado da página
    let unidades = [];
    let colaboradores = [];
    let produtos = [];
    let categorias = [];
    let quantidadesDigitadas = {};
    let selectedUnidade = '';

    // Funções de busca (simuladas)
    async function fetchUnidades() {
        console.log("TODO: Buscar unidades");
        return [{ id: 'un-1', nome_unidade: 'Matriz' }, { id: 'un-2', nome_unidade: 'Filial Centro' }];
    }
    async function fetchColaboradoresDaUnidade(unidadeId) {
        console.log("TODO: Buscar colaboradores da unidade", unidadeId);
        return [{ id: 'col-1', nome_colaborador: 'João da Silva' }, { id: 'col-2', nome_colaborador: 'Maria Oliveira' }];
    }
    async function fetchProdutosDaEmpresa() {
        console.log("TODO: Buscar produtos da empresa");
        return [{ id: 'prod-1', codigo_produto: '001', nome_produto: 'Pão Francês', categorias: [{nome_categoria: 'Padaria'}] }];
    }

    async function handleUnitSelection(event) {
        const unidadeId = event.target.value;
        selectedUnidade = unidadeId;
        if (unidadeId) {
            colaboradores = await fetchColaboradoresDaUnidade(unidadeId);
            produtos = await fetchProdutosDaEmpresa();
        } else {
            colaboradores = [];
            produtos = [];
        }
    }

    async function gerarArquivoTXT() {
        const colaboradorSelect = document.getElementById('selectColaboradorContagem');
        const unidadeSelect = document.getElementById('selectUnidadeContagem');
        if (!selectedUnidade || !colaboradorSelect.value) {
            alert("Por favor, selecione a Unidade e o Colaborador.");
            return;
        }

        const colaboradorNome = colaboradorSelect.options[colaboradorSelect.selectedIndex]?.text || "Colaborador";
        const unidadeNome = unidadeSelect.options[unidadeSelect.selectedIndex]?.text || "Unidade";
        
        // Lógica para gerar o conteúdo do TXT
        let conteudoTXT = "";
        // ... (código para montar o conteudoTXT a partir de `quantidadesDigitadas`)

        // --- LÓGICA DO NOME DO ARQUIVO ATUALIZADA ---
        const dataAtual = new Date();
        const dataFormatada = `${dataAtual.getFullYear()}${String(dataAtual.getMonth() + 1).padStart(2, '0')}${String(dataAtual.getDate()).padStart(2, '0')}`;
        const nomeColaboradorSanitizado = colaboradorNome.split(' ')[0].replace(/[^a-zA-Z0-9]/g, '');
        const nomeUnidadeSanitizado = unidadeNome.replace(/[^a-zA-Z0-9]/g, '_');
        const nomeArquivo = `${dataFormatada}_${nomeColaboradorSanitizado}_${nomeUnidadeSanitizado}.txt`;

        console.log(`TODO: Gerar arquivo "${nomeArquivo}" e salvar histórico.`);
        // A lógica de triggerDownload(nomeArquivo, conteudoTXT) e de salvar no banco viria aqui.
        alert(`Simulação: Arquivo ${nomeArquivo} seria gerado.`);
    }

    onMount(async () => {
        unidades = await fetchUnidades();
    });
</script>

<div class="page-container">
    <a href="/dashboard" class="back-button">&larr; Voltar ao Painel</a>
    <h2>Contagem de Estoque</h2>

    <div class="card">
        <div class="card-body">
            <div class="form-group">
                <label for="selectUnidadeContagem" style="font-weight: 600;">Passo 1: Selecione a Unidade</label>
                <select id="selectUnidadeContagem" on:change={handleUnitSelection}>
                    <option value="">-- Selecione --</option>
                    {#each unidades as unidade (unidade.id)}
                        <option value={unidade.id}>{unidade.nome_unidade}</option>
                    {/each}
                </select>
            </div>
        </div>
    </div>

    {#if selectedUnidade}
        <div class="card">
            <div class="card-body">
                <div class="form-group">
                    <label for="selectColaboradorContagem" style="font-weight: 600;">Passo 2: Contagem realizada por</label>
                    <select id="selectColaboradorContagem">
                        <option value="">-- Selecione --</option>
                        {#each colaboradores as col (col.id)}
                            <option value={col.id}>{col.nome_colaborador}</option>
                        {/each}
                    </select>
                </div>
            </div>
        </div>
        <div class="actions-bar" style="border:none; justify-content:center; display:flex; gap: 0.5rem;">
            <button on:click={gerarArquivoTXT} class="btn-success">Gerar TXT & Salvar</button>
        </div>
    {/if}
</div>

<style>
    .page-container { width: 100%; max-width: 900px; margin: auto; }
    .back-button { display: inline-block; margin-bottom: 1.5rem; font-weight: 500; color: var(--primary-color, #0052cc); text-decoration: none; }
    .back-button:hover { text-decoration: underline; }
</style>