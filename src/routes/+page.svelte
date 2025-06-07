<script>
    import { goto } from '$app/navigation';
    import { supabase } from '$lib/supabaseClient';

    let email = '';
    let password = '';
    let errorMessage = '';
    let loading = false;

    async function handleLogin() {
        loading = true;
        errorMessage = '';

        // --- Logs de Depuração no handleLogin ---
        console.log('--- +page.svelte: handleLogin ACIONADO! ---');
        console.log('--- +page.svelte: Tentando login com e-mail:', email);
        console.log('--- +page.svelte: Chamando supabase.auth.signInWithPassword...');

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            // Log de resposta detalhado do Supabase Auth
            console.log('--- +page.svelte: Resposta de supabase.auth.signInWithPassword recebida. Data:', data, 'Erro:', error);

            if (error) {
                console.error('--- +page.svelte: Erro detalhado do login (Supabase):', error);
                throw error; // Lança o erro para o catch
            }

            console.log('--- +page.svelte: Login bem-sucedido no Supabase Auth. Redirecionando...');
            goto('/dashboard');

        } catch (error) {
            errorMessage = 'Email ou senha inválidos. Tente novamente.';
            console.error('--- +page.svelte: Erro capturado no frontend (geral):', error.message || error);
        } finally {
            loading = false;
            console.log('--- +page.svelte: Processo de login finalizado. Loading:', loading);
        }
    }
</script>

<div class="login-container">
    <div class="card">
        <h1>Balanço de Estoque Pro</h1>
        <p>Faça login para continuar</p>

        <form on:submit|preventDefault={handleLogin}>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" bind:value={email} required placeholder="seu@email.com">
            </div>

            <div class="form-group">
                <label for="password">Senha</label>
                <input type="password" id="password" bind:value={password} required>
            </div>

            {#if errorMessage}
                <p class="error-message">{errorMessage}</p>
            {/if}

            <button type="submit" class="btn-primary" disabled={loading}>
                {#if loading}
                    Entrando...
                {:else}
                    Entrar
                {/if}
            </button>
        </form>
    </div>
</div>

<style>
    .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 80vh;
        width: 100%;
    }
    .card {
        width: 100%;
        max-width: 400px;
        padding: 2.5rem;
        background-color: #fff;
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        text-align: center;
    }
    h1 {
        font-size: 1.75rem;
        margin-bottom: 0.5rem;
    }
    p {
        color: #606770;
        margin-bottom: 2rem;
    }
    .form-group {
        text-align: left;
        margin-bottom: 1.5rem;
    }
    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
    }
    input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ced4da;
        border-radius: 0.375rem;
        box-sizing: border-box; /* Importante para o padding não estourar a largura */
    }
    .btn-primary {
        width: 100%;
        padding: 0.75rem;
        font-size: 1rem;
        font-weight: 600;
        background-color: var(--primary-color, #0052cc);
        color: #fff;
    }
    .btn-primary:disabled {
        background-color: #adb5bd;
        cursor: not-allowed;
    }
    .error-message {
        color: var(--danger-color, #d93025);
        font-size: 0.9rem;
        margin-bottom: 1rem;
    }
</style>