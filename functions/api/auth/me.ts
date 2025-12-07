import { Env, isAuthenticated, corsHeaders } from '../../shared';

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { request, env } = context;
    const authenticated = await isAuthenticated(request, env);

    return new Response(JSON.stringify({ authenticated }), {
        headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(),
        },
    });
};
