<script>
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabaseClient';
    import { user } from '$lib/sessionStore';

    onMount(() => {
        // Pega a sessão inicial quando a página carrega
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                fetchUserProfile(session.user);
            } else {
                $user = null;
            }
        });

        // Fica "ouvindo" por mudanças (login/logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
                fetchUserProfile(session.user);
            } else {
                $user = null;
            }
        });

        // Limpa o "ouvinte" quando o componente é destruído para evitar vazamento de memória
        return () => subscription.unsubscribe();
    });

    async function fetchUserProfile(authUser) {
        // Busca os dados da nossa tabela 'user_profiles'
        const { data: profile, error } = await supabase
            .from('user_profiles')
            .select('role, empresa_id, full_name, empresas (nome_empresa)')
            .eq('id', authUser.id)
            .single();

        if (error) {
            console.error('Erro ao buscar perfil:', error.message);
            // Se não achar o perfil, usa os dados básicos do auth
            $user = { ...authUser }; 
        } else {
            // Combina os dados do auth com os dados do perfil
            $user = {
                ...authUser,
                role: profile.role,
                empresa_id: profile.empresa_id,
                full_name: profile.full_name,
                empresa_nome: profile.empresas?.nome_empresa
            };
        }
    }
</script>

<slot />