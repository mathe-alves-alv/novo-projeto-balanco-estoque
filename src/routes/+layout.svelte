<script>
    import { user } from '$lib/sessionStore'; // Agora esta store será atualizada pelo sessionStore.js
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import '../app.css'; // Importa seu CSS global aqui para estilização

    onMount(() => {
        // O 'user' store agora se atualiza automaticamente no sessionStore.js.
        // Este layout apenas reage às mudanças da store.
        const unsubscribe = user.subscribe($user_value => {
            // Se o usuário não está logado E não está na página de login ou signup, redirecione.
            if (!$user_value) {
                const currentPath = window.location.pathname;
                if (currentPath !== '/' && currentPath !== '/signup') { // Adicione /signup se tiver uma página de cadastro
                    goto('/');
                }
            }
        });

        // Retorna uma função de limpeza para o Svelte.
        // Isso é importante para evitar vazamentos de memória.
        return unsubscribe;
    });
</script>

<slot />