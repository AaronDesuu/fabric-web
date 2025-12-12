import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Create the next-intl middleware
const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    // Handle admin routes separately (no i18n for admin)
    if (pathname.startsWith('/admin')) {
        return handleAdminRoute(request);
    }

    // Apply i18n middleware for all other routes
    return intlMiddleware(request);
}

async function handleAdminRoute(request) {
    const { pathname } = request.nextUrl;

    // ALWAYS allow access to login page - no checks, no redirects
    if (pathname === '/admin/login') {
        return NextResponse.next();
    }

    // For all other admin routes, check authentication
    let response = NextResponse.next();

    try {
        const supabase = createSupabaseClient(request, response);
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            // Not authenticated, redirect to login
            const loginUrl = new URL('/admin/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }

        // Check if user is in admin_users table
        const { data: adminData, error: adminError } = await supabase
            .from('admin_users')
            .select('id, role')
            .eq('id', user.id)
            .single();

        if (adminError || !adminData) {
            // User is authenticated but not an admin
            // Redirect to login with error message
            const loginUrl = new URL('/admin/login', request.url);
            loginUrl.searchParams.set('error', 'not_admin');
            return NextResponse.redirect(loginUrl);
        }

        // User is authenticated and is an admin, allow access
        return response;

    } catch (err) {
        // On any error, redirect to login
        console.error('Middleware auth error:', err);
        const loginUrl = new URL('/admin/login', request.url);
        return NextResponse.redirect(loginUrl);
    }
}

function createSupabaseClient(request, response) {
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value);
                        response.cookies.set(name, value, options);
                    });
                },
            },
        }
    );
}

export const config = {
    matcher: [
        // Match all paths except static files and api
        '/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ]
};
