<script>
    import { supabase } from '$lib/supabaseClient';
    import { user } from '$lib/sessionStore';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    onMount(() => {
        // Se, após carregar, a store indicar que não há usuário,
        // mandamos ele de volta para a página de login.
        if (!$user) {
            goto('/');
        }
    });

    async function handleLogout() {
        await supabase.auth.signOut();
        goto('/');
    }
</script>

{#if $user}
    <div class="page-container">
        <h2>Painel Principal</h2>
        <p style="margin-bottom: 2rem;">Bem-vindo, <strong>{$user.email}</strong>!</p>
        
        <div class="dashboard-grid">
            
            <a href="/dashboard/unidades" class="dashboard-card-link">
                <div class="dashboard-card">
                    <div class="icon">📍</div>
                    <h4>Gerenciar Unidades</h4>
                    <p>Adicione ou remova as filiais da sua empresa.</p>
                </div>
            </a>

            <a href="/dashboard/produtos" class="dashboard-card-link">
                <div class="dashboard-card">
                    <div class="icon">📦</div>
                    <h4>Gerenciar Produtos</h4>
                    <p>Adicione produtos e gerencie suas categorias.</p>
                </div>
            </a>

            <a href="#" class="dashboard-card-link">
                <div class="dashboard-card" style="background-color: #f8f9fa; opacity: 0.6;">
                    <div class="icon">🏷️</div>
                    <h4>Categorias</h4>
                    <p>(Em breve)</p>
                </div>
            </a>
            
           <a href="/dashboard/colaboradores" class="dashboard-card-link">
    <div class="dashboard-card">
        <div class="icon">👥</div>
        <h4>Colaboradores</h4>
        <p>Cadastre os responsáveis pela contagem.</p>
    </div>
</a>

{#if $user && ($user.role === 'admin_master' || $user.role === 'empresa_manager')}
    <a href="/dashboard/usuarios" class="dashboard-card-link">
        <div class="dashboard-card">
            <div class="icon">🔑</div>
            <h4>Gerenciar Usuários</h4>
            <p>Crie e gerencie os acessos ao sistema.</p>
        </div>
    </a>
{/if}

            <a href="/dashboard/contagem" class="dashboard-card-link">
    <div class="dashboard-card">
        <div class="icon">🔍</div><h4>Nova Contagem</h4><p>Inicie uma nova contagem de inventário.</p>
    </div>
</a>

<a href="/dashboard/historico" class="dashboard-card-link">
    <div class="dashboard-card">
        <div class="icon">📜</div><h4>Histórico</h4><p>Visualize contagens passadas.</p>
    </div>
</a>

        </div>

        <div class="actions">
            <button on:click={handleLogout} class="btn-secondary">Sair</button>
        </div>
    </div>
{/if}

<style>
    .page-container {
        text-align: center;
        padding: 2rem;
        width: 100%;
        max-width: 900px;
        margin: auto;
    }
    .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 1.5rem;
        margin-top: 2rem;
    }
    .dashboard-card-link {
        text-decoration: none;
        color: inherit;
    }
    .dashboard-card {
        background-color: #fff;
        border-radius: 0.5rem;
        padding: 1.5rem;
        text-align: center;
        border: 1px solid #dee2e6;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        transition: all .2s ease-in-out;
        height: 100%;
    }
    .dashboard-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        border-color: var(--primary-color, #0052cc);
    }
    .icon {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        color: var(--primary-color, #0052cc);
    }
    .dashboard-card h4 {
        font-size: 1.1rem;
        font-weight: 600;
        margin: 0 0 0.5rem 0;
    }
    .dashboard-card p {
        font-size: 0.9rem;
        color: #606770;
        margin: 0;
    }
    .actions {
        margin-top: 2.5rem;
        text-align: right;
    }
</style>