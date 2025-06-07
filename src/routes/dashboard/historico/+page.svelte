<script>
    import { onMount } from 'svelte';

    let historico = [];
    let isLoading = true;

    async function fetchHistorico() {
        isLoading = true;
        console.log("TODO: Buscar histórico do banco de dados");
        // Simulação
        historico = [
            { id: 'hist-1', created_at: new Date().toISOString(), unidade_nome_snapshot: 'Matriz', colaborador_nome: 'João da Silva', itens_contados: 5, dados_contagem: [{codigo: '001', quantidade: 10}] },
            { id: 'hist-2', created_at: new Date().toISOString(), unidade_nome_snapshot: 'Filial Centro', colaborador_nome: 'Maria Oliveira', itens_contados: 8, dados_contagem: [{codigo: '002', quantidade: 15}] }
        ];
        isLoading = false;
    }

    function handleDownloadFromHistory(historyRecord) {
        if (!historyRecord || !historyRecord.dados_contagem) {
            alert("Dados do histórico estão incompletos.");
            return;
        }
        const produtosParaExportar = historyRecord.dados_contagem.filter(p => p.quantidade > 0);
        if (produtosParaExportar.length === 0) {
            alert("Esta contagem não continha itens com quantidade maior que zero.");
            return;
        }
        let conteudoTXT = "";
        produtosParaExportar.forEach(produto => {
            conteudoTXT += `${produto.codigo};${produto.quantidade}\n`;
        });
        
        const dataContagem = new Date(historyRecord.created_at);
        const dataFormatada = `${dataContagem.getFullYear()}${String(dataContagem.getMonth() + 1).padStart(2, '0')}${String(dataContagem.getDate()).padStart(2, '0')}`;
        const nomeUnidadeSanitizado = (historyRecord.unidade_nome_snapshot || 'Unidade').replace(/[^a-zA-Z0-9]/g, '_');
        const nomeColaboradorSanitizado = (historyRecord.colaborador_nome || 'Colaborador').split(' ')[0].replace(/[^a-zA-Z0-9]/g, '');
        const nomeArquivo = `${dataFormatada}_${nomeColaboradorSanitizado}_${nomeUnidadeSanitizado}_HISTORICO.txt`;

        // Função utilitária para acionar o download (precisaria ser definida ou importada)
        // triggerDownload(nomeArquivo, conteudoTXT);
        alert(`Simulação: Baixando arquivo "${nomeArquivo}"`);
    }

    onMount(fetchHistorico);
</script>

<div class="page-container">
    <a href="/dashboard" class="back-button">&larr; Voltar ao Painel</a>
    <h2>Histórico de Contagens</h2>
    <div class="card">
        <div class="card-body" style="padding:0; overflow-x:auto;">
            <table>
                <thead><tr><th>Data</th><th>Unidade</th><th>Colaborador</th><th>Itens Contados</th><th>Ações</th></tr></thead>
                <tbody>
                    {#if isLoading}
                        <tr><td colspan="5" style="text-align:center;">Carregando...</td></tr>
                    {:else if historico.length === 0}
                        <tr><td colspan="5" style="text-align:center;">Nenhum histórico encontrado.</td></tr>
                    {:else}
                        {#each historico as reg (reg.id)}
                            <tr>
                                <td>{new Date(reg.created_at).toLocaleString('pt-BR')}</td>
                                <td>{reg.unidade_nome_snapshot}</td>
                                <td>{reg.colaborador_nome}</td>
                                <td>{reg.itens_contados}</td>
                                <td style="text-align: center;">
                                    <button on:click={() => handleDownloadFromHistory(reg)} class="btn-secondary table-actions">Baixar TXT</button>
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