import { Env } from '../../shared';

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { env } = context;
    const clientId = env.GITHUB_CLIENT_ID;
    const redirectUri = new URL('/api/auth/callback', context.request.url).href;
    const scope = 'user:email';

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        scope,
    });

    return Response.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`, 302);
};
