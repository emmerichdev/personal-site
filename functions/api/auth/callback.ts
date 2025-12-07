import { Env, createSessionCookie } from '../../shared';

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { request, env } = context;
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');

    if (error || !code) {
        return new Response('OAuth error', { status: 400 });
    }

    try {
        // Exchange code for access token
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'User-Agent': 'personal-site-auth',
            },
            body: JSON.stringify({
                client_id: env.GITHUB_CLIENT_ID,
                client_secret: env.GITHUB_CLIENT_SECRET,
                code,
            }),
        });

        const tokenData = await tokenResponse.json() as { access_token: string; error?: string };

        if (tokenData.error || !tokenData.access_token) {
            console.error('Token Error:', tokenData);
            return new Response('Failed to get access token', { status: 401 });
        }

        // Get user emails
        const emailsResponse = await fetch('https://api.github.com/user/emails', {
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`,
                'User-Agent': 'personal-site-auth',
            },
        });

        const emails = await emailsResponse.json() as { email: string; primary: boolean; verified: boolean }[];
        const primaryEmail = emails.find(e => e.primary && e.verified)?.email;

        if (!primaryEmail) {
            return new Response('No primary verified email found', { status: 401 });
        }

        if (primaryEmail !== 'emmerichhbrowne@gmail.com') {
            return new Response('Unauthorized user', { status: 403 });
        }

        // Create session
        const cookie = await createSessionCookie(primaryEmail, env.SESSION_SECRET);

        return new Response(null, {
            status: 302,
            headers: {
                'Location': '/admin',
                'Set-Cookie': cookie,
            },
        });

    } catch (err) {
        console.error('Auth Error:', err);
        return new Response('Internal Server Error', { status: 500 });
    }
};
