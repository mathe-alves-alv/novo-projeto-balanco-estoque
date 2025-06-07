<script>
    import { onMount } from 'svelte';
    import { user } from '$lib/sessionStore';

    let empresas = [];
    let usuariosDaEmpresa = [];
    let unidadesDaEmpresa = [];
    
    let selectedEmpresaId = null;
    let isLoading = true;

    // --- Funções de busca (simulação) ---
    async function fetchEmpresas() {
        console.log("TODO: Buscar todas as empresas");
        return [{ id: 'emp-1', nome_empresa: 'Padaria Pão Quente' }, { id: 'emp-2', nome_empresa: 'Mercado Preço Bom' }];
    }

    async function fetchUnidades(empresaId) {
        console.log("TODO: Buscar unidades da empresa:", empresaId);
        return [{ id: 'un-1', nome_unidade: 'Matriz' }, { id: 'un-2', nome_unidade: 'Filial' }];
    }

    async function fetchUsuarios(empresaId) {
        isLoading = true;
        console.log("TODO: Buscar usuários da empresa:", empresaId);
        usuariosDaEmpresa = [
            { id: 'user-1', email: 'gerente@email.com', role: 'empresa_manager', unidades: [{nome_unidade: 'Matriz'}] },
            { id: 'user-2', email: 'contador1@email.com', role: 'empresa_counter', unidades: [{nome_unidade: 'Filial'}] }
        ];
        isLoading = false;
    }

    async function handleEmpresaSelection(event) {
        selectedEmpresaId = event.target.value;
        if (selectedEmpresaId) {
            unidadesDaEmpresa = await fetchUnidades(selectedEmpresaId);
            await fetchUsuarios(selectedEmpresaId);
        } else {
            usuariosDaEmpresa = [];
            unidadesDaEmpresa = [];
        }
    }

    onMount(async () => {
        if ($user.role === 'admin_master') {
            empresas = await fetchEmpresas();
            isLoading = false;
        } else if ($user.role === 'empresa_manager') {
            selectedEmpresaId = $user.empresa_id;
            unidadesDaEmpresa = await fetchUnidades(selectedEmpresaId);
            await fetchUsuarios(selectedEmpresaId);
        }
    });
</script>

<div class="page-container">
    <a href="/dashboard" class="back-button">&larr; Voltar ao Painel</a>
    <h2>Gerenciar Usuários</h2>

    {#if $user.role === 'admin_master'}
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
            </div>

        <div class="card">
            <div class="card-header"><h3>Usuários Cadastrados</h3></div>
            <div class="card-body" style="padding:0;">
                <table>
                    <thead><tr><th>Email</th><th>Função</th><th>Unidades</th><th>Ações</th></tr></thead>
                    <tbody>
                        {#if isLoading}
                            <tr><td colspan="4">Carregando...</td></tr>
                        {:else}
                            {#each usuariosDaEmpresa as usr (usr.id)}
                                <tr>
                                    <td>{usr.email}</td>
                                    <td>{usr.role === 'empresa_manager' ? 'Administrador' : 'Contador'}</td>
                                    <td>{usr.unidades.map(u => u.nome_unidade).join(', ')}</td>
                                    <td></td>
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
    /* Estilos aqui */
</style>