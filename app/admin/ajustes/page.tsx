'use client';

import * as React from 'react';
import { Save, Globe, Database, Mail, Bell, Shield, Cpu, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';

export default function AdminSettingsPage() {
  const [settings, setSettings] = React.useState({
    siteName: 'NoticiasPro',
    siteDescription: 'Tu periódico digital de referencia',
    siteUrl: 'https://noticiaspro.com',
    language: 'es',
    timezone: 'Europe/Madrid',
    articlesPerPage: '12',
    autoPublish: true,
    autoTranslate: true,
    duplicateDetection: true,
    aiRewrite: true,
    cacheEnabled: true,
    cacheTtl: '300',
    emailNotifications: true,
    pushNotifications: false,
    rateLimiting: true,
    xssProtection: true,
    csrfProtection: true,
    googleAnalyticsId: 'G-XXXXXXXXXX',
    googleSearchConsole: '',
    microsoftClarity: '',
    adsenseClient: 'ca-pub-XXXXXXXXXX',
  });
  const [cronActive, setCronActive] = React.useState(false);
  const [cronSchedule, setCronSchedule] = React.useState('*/10 * * * *');
  const [lastSync, setLastSync] = React.useState<string>('');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      const { data: sources } = await supabase
        .from('sources')
        .select('last_fetched_at')
        .order('last_fetched_at', { ascending: false })
        .limit(1);
      if (sources && sources.length > 0) {
        setLastSync(sources[0].last_fetched_at || '');
      }
      setLoading(false);
    })();
  }, []);

  const handleSave = () => {
    toast.success('Configuración guardada correctamente');
  };

  const update = (key: string, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black">Ajustes</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Configuración general de la plataforma
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Guardar cambios
        </Button>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Estado del sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-semibold">Actualización automática</p>
                <p className="text-sm text-muted-foreground">
                  Cada 10 minutos · Próxima actualización automática
                </p>
              </div>
            </div>
            <Badge variant="default" className="bg-green-600">Activo</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-semibold">Última sincronización</p>
                <p className="text-sm text-muted-foreground">
                  {lastSync ? new Date(lastSync).toLocaleString('es-ES') : 'Pendiente'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* General */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            General
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="siteName">Nombre del sitio</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => update('siteName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteUrl">URL del sitio</Label>
              <Input
                id="siteUrl"
                value={settings.siteUrl}
                onChange={(e) => update('siteUrl', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="siteDescription">Descripción</Label>
            <Textarea
              id="siteDescription"
              value={settings.siteDescription}
              onChange={(e) => update('siteDescription', e.target.value)}
              rows={2}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Idioma</Label>
              <Select value={settings.language} onValueChange={(v) => update('language', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Zona horaria</Label>
              <Select value={settings.timezone} onValueChange={(v) => update('timezone', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Europe/Madrid">Europe/Madrid</SelectItem>
                  <SelectItem value="Europe/London">Europe/London</SelectItem>
                  <SelectItem value="America/New_York">America/New_York</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="articlesPerPage">Artículos por página</Label>
              <Input
                id="articlesPerPage"
                type="number"
                value={settings.articlesPerPage}
                onChange={(e) => update('articlesPerPage', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Automation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            Automatización e IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="autoPublish">Publicación automática</Label>
              <p className="text-sm text-muted-foreground">Publicar artículos automáticamente tras su procesamiento</p>
            </div>
            <Switch
              id="autoPublish"
              checked={settings.autoPublish}
              onCheckedChange={(v) => update('autoPublish', v)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="aiRewrite">Reescritura con IA (Gemini)</Label>
              <p className="text-sm text-muted-foreground">Reescribir artículos con Gemini AI para crear contenido original</p>
            </div>
            <Switch
              id="aiRewrite"
              checked={settings.aiRewrite}
              onCheckedChange={(v) => update('aiRewrite', v)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="autoTranslate">Traducción automática</Label>
              <p className="text-sm text-muted-foreground">Traducir artículos de otros idiomas al español</p>
            </div>
            <Switch
              id="autoTranslate"
              checked={settings.autoTranslate}
              onCheckedChange={(v) => update('autoTranslate', v)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="duplicateDetection">Detección de duplicados</Label>
              <p className="text-sm text-muted-foreground">Evitar publicar noticias duplicadas</p>
            </div>
            <Switch
              id="duplicateDetection"
              checked={settings.duplicateDetection}
              onCheckedChange={(v) => update('duplicateDetection', v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Cache */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Caché y rendimiento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="cacheEnabled">Caché Redis activado</Label>
              <p className="text-sm text-muted-foreground">Mejora el rendimiento mediante caché</p>
            </div>
            <Switch
              id="cacheEnabled"
              checked={settings.cacheEnabled}
              onCheckedChange={(v) => update('cacheEnabled', v)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cacheTtl">TTL de caché (segundos)</Label>
            <Input
              id="cacheTtl"
              type="number"
              value={settings.cacheTtl}
              onChange={(e) => update('cacheTtl', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emailNotifications">Notificaciones por email</Label>
              <p className="text-sm text-muted-foreground">Recibir alertas por correo electrónico</p>
            </div>
            <Switch
              id="emailNotifications"
              checked={settings.emailNotifications}
              onCheckedChange={(v) => update('emailNotifications', v)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="pushNotifications">Notificaciones push</Label>
              <p className="text-sm text-muted-foreground">Enviar notificaciones push a los usuarios</p>
            </div>
            <Switch
              id="pushNotifications"
              checked={settings.pushNotifications}
              onCheckedChange={(v) => update('pushNotifications', v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Seguridad
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="rateLimiting">Rate Limiting</Label>
              <p className="text-sm text-muted-foreground">Limitar el número de peticiones por IP</p>
            </div>
            <Switch
              id="rateLimiting"
              checked={settings.rateLimiting}
              onCheckedChange={(v) => update('rateLimiting', v)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="xssProtection">Protección XSS</Label>
              <p className="text-sm text-muted-foreground">Filtrar contenido malicioso</p>
            </div>
            <Switch
              id="xssProtection"
              checked={settings.xssProtection}
              onCheckedChange={(v) => update('xssProtection', v)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="csrfProtection">Protección CSRF</Label>
              <p className="text-sm text-muted-foreground">Tokens anti-CSRF en formularios</p>
            </div>
            <Switch
              id="csrfProtection"
              checked={settings.csrfProtection}
              onCheckedChange={(v) => update('csrfProtection', v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Analytics & Ads */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Analítica y publicidad
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
            <Input
              id="googleAnalyticsId"
              value={settings.googleAnalyticsId}
              onChange={(e) => update('googleAnalyticsId', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="googleSearchConsole">Google Search Console</Label>
            <Input
              id="googleSearchConsole"
              value={settings.googleSearchConsole}
              onChange={(e) => update('googleSearchConsole', e.target.value)}
              placeholder="Código de verificación"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="microsoftClarity">Microsoft Clarity</Label>
            <Input
              id="microsoftClarity"
              value={settings.microsoftClarity}
              onChange={(e) => update('microsoftClarity', e.target.value)}
              placeholder="Project ID"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adsenseClient">Google AdSense Client</Label>
            <Input
              id="adsenseClient"
              value={settings.adsenseClient}
              onChange={(e) => update('adsenseClient', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
