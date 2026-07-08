'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Newspaper, LogIn, UserPlus, Mail, Lock, Loader2, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

// Validation schemas
const emailSchema = z.string().email('Email inválido');
const passwordSchema = z.string().min(6, 'La contraseña debe tener al menos 6 caracteres');

export default function LoginPage() {
  const [mode, setMode] = React.useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (user) {
      router.push('/admin');
    }
  }, [user, router]);

  const validateInput = (): boolean => {
    setError(null);
    
    try {
      emailSchema.parse(email);
    } catch {
      setError('Por favor, introduce un email válido');
      return false;
    }
    
    if (mode !== 'forgot') {
      try {
        passwordSchema.parse(password);
      } catch (e) {
        setError(e instanceof z.ZodError ? e.errors[0].message : 'Contraseña inválida');
        return false;
      }
    }
    
    if (mode === 'register' && password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInput()) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Check rate limit
    const { data: rateLimitOk } = await supabase.rpc('check_rate_limit', { p_email: email });
    if (rateLimitOk === false) {
      setError('Demasiados intentos. Por favor, espera 15 minutos.');
      setLoading(false);
      return;
    }

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        // Log attempt
        await supabase.rpc('log_login_attempt', { 
          p_email: email, 
          p_success: !error 
        });
        
        if (error) throw new Error(error);
        router.push('/admin');
      } else if (mode === 'register') {
        const { error } = await signUp(email, password);
        if (error) throw new Error(error);
        setSuccess('Cuenta creada. Revisa tu correo para confirmar.');
        setMode('login');
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/login`,
        });
        if (error) throw new Error(error.message);
        setSuccess('Se ha enviado un correo con instrucciones para recuperar tu contraseña.');
      }
    } catch (err) {
      // Sanitize error message
      const message = err instanceof Error ? err.message : 'Ha ocurrido un error';
      // Don't expose internal errors
      if (message.includes('Invalid login credentials')) {
        setError('Email o contraseña incorrectos');
      } else if (message.includes('Email not confirmed')) {
        setError('Por favor, confirma tu email primero');
      } else if (message.includes('User already registered')) {
        setError('Este email ya está registrado');
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getIcon = () => {
    switch (mode) {
      case 'login': return <LogIn className="h-8 w-8" />;
      case 'register': return <UserPlus className="h-8 w-8" />;
      case 'forgot': return <Mail className="h-8 w-8" />;
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Iniciar Sesión';
      case 'register': return 'Crear Cuenta';
      case 'forgot': return 'Recuperar Contraseña';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'login': return 'Accede a tu panel de administración';
      case 'register': return 'Regístrate para acceder al panel';
      case 'forgot': return 'Te enviaremos un enlace para restablecer tu contraseña';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <Card className="border-border/50 shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl news-gradient text-white">
              {getIcon()}
            </div>
            <CardTitle className="font-serif text-2xl">
              {getTitle()}
            </CardTitle>
            <CardDescription>
              {getDescription()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm" role="alert">
                <AlertCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 text-sm" role="status">
                <CheckCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="pl-10"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="pl-10"
                      required
                      minLength={6}
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    />
                  </div>
                </div>
              )}

              {mode === 'register' && (
                <div className="space-y-2">
                  <label htmlFor="confirm-password" className="text-sm font-medium">Confirmar Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repite tu contraseña"
                      className="pl-10"
                      required
                      minLength={6}
                      autoComplete="new-password"
                    />
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                    Procesando...
                  </>
                ) : mode === 'login' ? (
                  'Iniciar Sesión'
                ) : mode === 'register' ? (
                  'Crear Cuenta'
                ) : (
                  'Enviar Enlace'
                )}
              </Button>
            </form>

            <div className="flex flex-col items-center gap-2">
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); setError(null); setSuccess(null); }}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Contraseña olvidada?
                </button>
              )}
              
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setError(null);
                  setSuccess(null);
                }}
                className="text-sm text-primary hover:underline"
              >
                {mode === 'login'
                  ? '¿No tienes cuenta? Regístrate'
                  : mode === 'register'
                  ? '¿Ya tienes cuenta? Inicia sesión'
                  : 'Volver a iniciar sesión'}
              </button>
            </div>

            {mode === 'forgot' && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(null); setSuccess(null); }}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Volver
                </button>
              </div>
            )}

            <div className="pt-4 border-t border-border text-center">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                <Newspaper className="h-4 w-4" aria-hidden="true" />
                Volver al sitio
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}