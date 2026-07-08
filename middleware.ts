import { createServerClient } from '@supabase/ssr';
import { NextResponse, NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Create Supabase client using SSR package
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );
  
  // Get session
  const { data: { session } } = await supabase.auth.getSession();
  
  // Check if trying to access admin routes
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = req.nextUrl.pathname === '/login';
  
  // Protect admin routes
  if (isAdminRoute) {
    if (!session) {
      // Redirect to login if not authenticated
      const redirectUrl = new URL('/login', req.url);
      return NextResponse.redirect(redirectUrl);
    }
    
    // Admin email check
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'ayoubnoob543@gmail.com';
    if (session.user.email !== adminEmail) {
      // Check if user has is_admin in profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single();
      
      if (!profile?.is_admin) {
        // Not admin, redirect to home
        const redirectUrl = new URL('/', req.url);
        return NextResponse.redirect(redirectUrl);
      }
    }
  }
  
  // Redirect logged in users away from login page
  if (isLoginPage && session) {
    const redirectUrl = new URL('/admin', req.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  // Add security headers
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-XSS-Protection', '1; mode=block');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  return res;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/login',
  ],
};