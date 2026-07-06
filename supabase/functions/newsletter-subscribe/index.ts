import { createClient } from "npm:@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    if (!email || !email.includes("@")) {
      return new Response(
        JSON.stringify({ error: "Email inválido" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Insert subscriber
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email, is_active: true });

    if (error) {
      if (error.code === "23505") {
        return new Response(
          JSON.stringify({ error: "Ya estás suscrito con este email" }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw error;
    }

    // Send confirmation email using Supabase's built-in email
    const emailResponse = await fetch(
      `${Deno.env.get("SUPABASE_URL")}/auth/v1/emails/send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          "apikey": Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
        },
        body: JSON.stringify({
          to: email,
          subject: "Bienvenido a NoticiasPro",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">NoticiasPro</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0;">Tu periódico digital</p>
              </div>
              <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
                <h2 style="color: #1f2937; margin-top: 0;">¡Suscripción confirmada!</h2>
                <p style="color: #4b5563; line-height: 1.6;">
                  Gracias por suscribirte a <strong>NoticiasPro</strong>. A partir de ahora recibirás:
                </p>
                <ul style="color: #4b5563; line-height: 1.8;">
                  <li>Las noticias más importantes cada mañana</li>
                  <li>Alertas de última hora en tiempo real</li>
                  <li>Resúmenes de deportes, tecnología y economía</li>
                </ul>
                <p style="color: #4b5563; line-height: 1.6;">
                  Puedes darte de baja en cualquier momento desde el enlace que aparecerá en cada correo.
                </p>
                <a href="https://noticiaspro.com" style="display: inline-block; background: #dc2626; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 10px;">
                  Visitar NoticiasPro
                </a>
              </div>
              <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px;">
                © 2026 NoticiasPro. Todos los derechos reservados.
              </p>
            </div>
          `,
        }),
      }
    );

    // Even if email fails, subscription was saved
    const emailSent = emailResponse.ok;

    return new Response(
      JSON.stringify({
        success: true,
        message: "Suscripción completada",
        emailSent,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
