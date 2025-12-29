import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Pilar, Confession, UserStats, Goal, UserIdentity } from '../../types';

export const useSupabaseSync = () => {
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchUserData = useCallback(async () => {
        if (!session?.user?.id) return null;

        const [
            { data: profile },
            { data: goals },
            { data: confessions },
            { data: pillarProgress },
            pillarsResult,
            sparksResult
        ] = await Promise.all([
            supabase.from('profiles').select('*').eq('id', session.user.id).single(),
            supabase.from('goals').select('*').eq('user_id', session.user.id),
            supabase.from('confessions').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }),
            supabase.from('pillar_progress').select('*').eq('user_id', session.user.id),
            supabase.from('pillars').select('*').order('id'),
            supabase.from('pillars').select('*').order('id'),
            supabase.from('daily_sparks').select('*').order('date', { ascending: false }).limit(30),
            // Fetch interactions for graph (last 7 days for now, can be optimized later)
            supabase.from('interactions').select('created_at, action_type').gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        ]);

        return {
            profile,
            goals: goals || [],
            confessions: confessions || [],
            pillarProgress: pillarProgress || [],
            pillars: pillarsResult.data || [],
            dailySparks: sparksResult.data || [],
            interactions: interactionsResult.data || [] // Pass raw interactions to Stats component to process
        };
    }, [session]);

    const saveProfile = async (updates: Partial<UserIdentity & UserStats>) => {
        if (!session?.user?.id) return;
        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', session.user.id);
        if (error) console.error('Error saving profile:', error);
    };

    const logInteraction = async (actionType: string, metadata: any = {}) => {
        if (!session?.user?.id) return;
        // Fire and forget - don't await to block UI
        supabase.from('interactions').insert({
            user_id: session.user.id,
            action_type: actionType,
            metadata
        }).then(({ error }) => {
            if (error) console.error('Error logging interaction:', error);
        });
    };

    const saveGoal = async (goal: Goal) => {
        if (!session?.user?.id) return;

        // Check if goal.id is a valid UUID
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(goal.id);

        const { error } = await supabase
            .from('goals')
            .upsert({
                id: isUUID ? goal.id : undefined,
                user_id: session.user.id,
                goal_title: goal.goal_title,
                target_date: goal.target_date || null,
                sub_tasks: goal.sub_tasks,
                progress_percentage: goal.progress_percentage
            });
        if (error) console.error('Error saving goal:', error);
    };

    const saveConfession = async (confession: Confession) => {
        if (!session?.user?.id) return;
        const { error } = await supabase
            .from('confessions')
            .insert({
                user_id: session.user.id,
                content: confession.content,
                type: confession.type,
                timestamp: confession.timestamp,
                date: confession.date,
                pilar_id: confession.pilarId,
                session_name: confession.sessionName,
                note: confession.note
            });
        if (error) console.error('Error saving confession:', error);
    };

    const savePilarProgress = async (pilarId: number, completed: boolean, unlocked: boolean) => {
        if (!session?.user?.id) return;
        const { error } = await supabase
            .from('pillar_progress')
            .upsert({
                user_id: session.user.id,
                pilar_id: pilarId,
                completed,
                unlocked
            });
        if (error) console.error('Error saving pillar progress:', error);
    };

    const logout = async () => {
        await supabase.auth.signOut();
    };

    return {
        session,
        loading,
        fetchUserData,
        saveProfile,
        saveGoal,
        saveConfession,
        savePilarProgress,
        logInteraction,
        logout
    };
};
