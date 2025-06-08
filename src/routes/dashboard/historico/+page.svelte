<script>
    import { onMount } from 'svelte';
    import { user } from '$lib/sessionStore';
    import { supabase } from '$lib/supabaseClient';

    let historico = [];
    let isLoading = true;

    // --- VERSÃO FINAL ---
    // Busca o histórico de contagens do banco de dados
    async function fetchHistorico() {
        isLoading = true;
        
        // A empresa_id vem do nosso sessionStore, que foi populado no login
        const empresaId = $user?.user_metadata?.empresa_id;

        if (!empresaId) {
            console.error("ID da empresa não encontrado para buscar o histórico.");
            isLoading = false;
            return;
        }

        const { data, error } = await supabase
            .from('historico_contagens')
            .select('*')
            .eq('empresa_id', empresaId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Erro ao buscar histórico:', error);
            alert('Não foi possível carregar o histórico de contagens.');
        } else {
            historico = data;
        }
        isLoading = false;
    }

    // --- VERSÃO FINAL ---
    // Gera o download do arquivo TXT a partir de um registro do histórico
    function handleDownloadFromHistory(historyRecord) {
        if (!historyRecord || !historyRecord.dados_contagem) {
            alert("Dados do histórico estão incompletos e não é possível gerar o arquivo.");
            return;
        }

        const produtosParaExportar = historyRecord.dados_contagem.filter(p => p.quantidade > 0);

        if (produtosParaExportar.length === 0) {
            alert("Esta contagem não continha itens com quantidade maior que zero para exportar.");
            return;
        }

        let conteudoTXT = "";
        produtosParaExportar.forEach(produto => {
            const codigo = produto.codigo || produto.produto_id;
            const quantidade = produto.quantidade;
            conteudoTXT += `${codigo};${quantidade}\n`;
        });

        const dataContagem = new Date(historyRecord.created_at);
        const dataFormatada = `${dataContagem.getFullYear()}${String(dataContagem.getMonth() + 1).padStart(2, '0')}${String(dataContagem.getDate()).padStart(2, '0')}`;
        const nomeUnidadeSanitizado = (historyRecord.unidade_nome_snapshot || 'Unidade').replace(/[^a-zA-Z0-9]/g, '_');
        const nomeColaboradorSanitizado = (historyRecord.colaborador_nome || 'Colaborador').split(' ')[0].replace(/[^a-zA-Z0-9]/g, '');
        
        const nomeArquivo = `${dataFormatada}_${nomeColaboradorSanitizado}_${nomeUnidadeSanitizado}_HISTORICO.txt`;

        triggerDownload(nomeArquivo, conteudoTXT);
    }
    
    // Função utilitária para acionar o download
    function triggerDownload(filename, textContent) {
        const blob = new Blob([textContent],{type:'text/plain;charset=utf-8'});
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }

    onMount(fetchHistorico);
</script>

<div class="page-container">
    <a href="/dashboard" class="back-button">&larr; Voltar ao Painel</a>
    <h2>Histórico de Contagens</h2>
    <div class="card">
        <div class="card-body" style="padding:0; overflow-x: auto;">
            <table>
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Unidade</th>
                        <th>Colaborador</th>
                        <th>Itens Contados</th>
                        <th class="actions-column">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {#if isLoading}
                        <tr><td colspan="5" class="centered-cell">Carregando...</td></tr>
                    {:else if historico.length === 0}
                        <tr><td colspan="5" class="centered-cell">Nenhum histórico encontrado.</td></tr>
                    {:else}
                        {#each historico as reg (reg.id)}
                            <tr>
                                <td>{new Date(reg.created_at).toLocaleString('pt-BR')}</td>
                                <td>{reg.unidade_nome_snapshot || 'N/A'}</td>
                                <td>{reg.colaborador_nome || 'N/A'}</td>
                                <td>{reg.itens_contados}</td>
                                <td class="actions-column">
                                    <button on:click={() => handleDownloadFromHistory(reg)} class="btn btn-secondary">Baixar TXT</button>
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
    .card-body { padding: 1.5rem; }
    .btn { padding: 0.6rem 1.2rem; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 500; color: white; }
    .btn-secondary { background-color: #6c757d; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 0.85rem 1rem; border-bottom: 1px solid #dee2e6; }
    th { background-color: #f8f9fa; font-weight: 600; }
    .actions-column { text-align: center; width: 150px; }
    .centered-cell { text-align: center; padding: 2rem; color: #606770; }
</style>