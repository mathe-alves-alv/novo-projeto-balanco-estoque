// src/lib/sessionStore.js

import { writable } from 'svelte/store';
import { supabase } from '$lib/supabaseClient';

export const user = writable(null);

async function getUserProfile(userId) {
    console.log('sessionStore: getUserProfile: Tentando buscar perfil para userId:', userId);
    if (!userId) {
        console.log('sessionStore: getUserProfile: userId nulo, retornando null.');
        return null;
    }

    console.log('sessionStore: getUserProfile: Preparando consulta ao user_profiles...'); // Log antes da consulta

    let profileData = null;
    let profileError = null;

    try {
        // --- Consulta SIMPLIFICADA SEM .single() e SEM JOIN temporariamente ---
        // Isso nos ajuda a isolar se o problema é a consulta base ou o .single() ou o join.
        const { data, error } = await supabase
            .from('user_profiles')
            .select('id, email, role, empresa_id'); // Apenas selecione colunas básicas, sem join

        console.log('sessionStore: getUserProfile: Resposta RAW da consulta:', { data, error }); // Log da resposta bruta

        if (error) {
            profileError = error;
        } else if (data && data.length === 1) {
            profileData = data[0]; // Se houver uma linha, pegamos o primeiro elemento
        } else if (data && data.length > 1) {
            // Se múltiplos perfis forem encontrados, isso é um erro de dados
            console.warn('sessionStore: getUserProfile: ATENÇÃO: Múltiplos perfis encontrados para o mesmo userId. Esperado apenas um.', data);
            profileError = { message: "Múltiplos perfis encontrados para o usuário. Isso é um erro nos dados." };
        } else {
            // Se 0 linhas forem retornadas
            console.log('sessionStore: getUserProfile: NENHUM perfil encontrado para o userId:', userId);
            profileError = { message: "Nenhum perfil encontrado para o usuário. Verifique a tabela user_profiles." };
        }

    } catch (e) {
        // Captura erros inesperados que podem não vir do Supabase diretamente (ex: TypeError)
        console.error('sessionStore: getUserProfile: Erro INESPERADO ao executar a consulta Supabase:', e);
        profileError = e;
    }

    if (profileError) {
        console.error('sessionStore: Erro final ao buscar perfil do usuário:', profileError);
        // Desloga o usuário se houver erro ao buscar o perfil
        await supabase.auth.signOut();
        return null;
    }

    if (profileData) {
        console.log('sessionStore: Perfil do usuário encontrado e processado:', profileData);
        // Retorna o perfil, adaptando para o formato esperado sem o nome da empresa por enquanto
        return {
            id: profileData.id,
            email: profileData.email,
            role: profileData.role,
            empresa_id: profileData.empresa_id,
            nome_empresa: null, // Definido como null porque removemos o join por enquanto
        };
    }

    // Se chegar aqui, algo deu errado e não foi capturado.
    console.log('sessionStore: Processo de busca de perfil finalizado sem sucesso.');
    return null;
}

supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('sessionStore: onAuthStateChange disparado. Evento:', event, 'Sessão:', session ? 'presente' : 'nula');
    if (session) {
        console.log('sessionStore: Sessão encontrada. Usuário:', session.user);
        const userProfile = await getUserProfile(session.user.id);
        
        if (userProfile) {
            console.log('sessionStore: Perfil do usuário carregado e store atualizada:', userProfile);
            user.set(userProfile);
        } else {
            console.log('sessionStore: Perfil do usuário não encontrado ou erro ao carregar. Deslogando...');
            user.set(null);
            await supabase.auth.signOut();
        }
    } else {
        console.log('sessionStore: Nenhuma sessão ou logout. Limpando store de usuário.');
        user.set(null);
    }
});