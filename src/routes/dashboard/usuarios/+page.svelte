<script>
    import { onMount } from 'svelte';
    import { user } from '$lib/sessionStore';

    let empresas = [];
    let usuarios = [];
    let unidades = [];
    let selectedEmpresaId = null;
    let isLoading = true;

    // --- Funções de busca (simulação) ---
    async function fetchEmpresas() {
        console.log("TODO: Buscar todas as empresas para o admin");
        return [{ id: 'emp-1', nome_empresa: 'Padaria Pão Quente (Exemplo)' }];
    }

    async function fetchUsuarios(empresaId) {
        isLoading = true;
        console.log("TODO: Buscar usuários da empresa:", empresaId);
        usuarios = [
            { id: 'user-1', email: 'gerente@exemplo.com', role: 'empresa_manager', unidades: ['Matriz'] },
            { id: 'user-2', email: 'contador@exemplo.com', role: 'empresa_counter', unidades: ['Filial'] }
        ];
        isLoading = false;
    }

    async function fetchUnidades(empresaId) {
        console.log("TODO: Buscar unidades da empresa:", empresaId);
        return [{ id: 'un-1', nome_unidade: 'Matriz' }, { id: 'un-2', nome_unidade: 'Filial' }];
    }

    async function handleEmpresaSelection(event) {
        selectedEmpresaId = event.target.value;
        if (selectedEmpresaId) {
            unidades = await fetchUnidades(selectedEmpresaId);
            await fetchUsuarios(selectedEmpresaId);
        } else {
            usuarios = [];
            unidades = [];
        }
    }

    onMount(async () => {
        if ($user.role === 'admin_master') {
            empresas = await fetchEmpresas();
            isLoading = false;
        } else if ($user.role === 'empresa_manager') {
            selectedEmpresaId = $user.empresa_id;
            unidades = await fetchUnidades(selectedEmpresaId);
            await fetchUsuarios(selectedEmpresaId);
        }
    });
</script>

<div class="page-container">
    <a href="/dashboard" class="back-button">&larr; Voltar ao Painel</a>
    <h2>Gerenciar Usuários</h2>

    {#if $user?.role === 'admin_master'}
        <div class="card">
            <div class="card-body">
                <div class="form-group">
                    <label for="selectEmpresa" style="font-weight: 600;">Selecione uma Empresa para Gerenciar:</label>
                    <select id="selectEmpresa" on:change={handleEmpresaSelection}>
                        <option value="">-- Selecione --</option>
                        {#each empresas as empresa (empresa.id)}
                            <option value={empresa.id}>{empresa.nome_empresa}</option>
                        {/each}
                    </select>
                </div>
            </div>
        </div>
    {/if}

    {#if selectedEmpresaId}
        <div class="card">
            <div class="card-header"><h3>Adicionar Novo Usuário</h3></div>
            <div class="card-body"><p>(Formulário de criação de usuário virá aqui)</p></div>
        </div>

        <div class="card">
            <div class="card-header"><h3>Usuários Cadastrados</h3></div>
            <div class="card-body" style="padding:0; overflow-x: auto;">
                <table>
                    <thead><tr><th>Email</th><th>Função</th><th>Unidades</th><th>Ações</th></tr></thead>
                    <tbody>
                        {#if isLoading}
                            <tr><td colspan="4" class="centered-cell">Carregando...</td></tr>
                        {:else if usuarios.length === 0}
                            <tr><td colspan="4" class="centered-cell">Nenhum usuário cadastrado.</td></tr>
                        {:else}
                            {#each usuarios as usr (usr.id)}
                                <tr>
                                    <td>{usr.email}</td>
                                    <td>{usr.role === 'empresa_manager' ? 'Administrador' : 'Contador'}</td>
                                    <td>{usr.unidades.join(', ')}</td>
                                    <td class="actions-column">
                                        <button class="btn btn-danger">Excluir</button>
                                    </td>
                                </tr>
                            {/each}
                        {/if}
                    </tbody>
                </table>
            </div>
        </div>
    {/if}
</div>

<style>
    /* Estilos seguem o padrão das outras páginas */
    .page-container { width: 100%; max-width: 900px; margin: auto; }
    .back-button { display: inline-block; margin-bottom: 1.5rem; font-weight: 500; text-decoration: none; }
    .card { background-color: #fff; border: 1px solid #dee2e6; border-radius: 0.5rem; margin-bottom: 1.5rem; }
    .card-header { padding: 1rem 1.5rem; border-bottom: 1px solid #dee2e6; }
    .card-header h3 { margin: 0; font-size: 1.25rem; }
    .card-body { padding: 1.5rem; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 0.85rem 1rem; border-bottom: 1px solid #dee2e6; }
    th { background-color: #f8f9fa; font-weight: 600; }
    .actions-column { text-align: center; width: 120px; }
    .centered-cell { text-align: center; padding: 2rem; color: #606770; }
</style>