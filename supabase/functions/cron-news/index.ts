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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const functionUrl = `${supabaseUrl}/functions/v1`;

    // Step 1: Fetch articles from all sources
    const fetchResponse = await fetch(`${functionUrl}/fetch-sources`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${anonKey}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(120000),
    });

    const fetchResult = await fetchResponse.json();

    // Step 2: Rewrite and publish pending articles
    const rewriteResponse = await fetch(`${functionUrl}/rewrite-ai`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${anonKey}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(120000),
    });

    const rewriteResult = await rewriteResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        fetch: fetchResult,
        rewrite: rewriteResult,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        error: err instanceof Error ? err.message : String(err),
        timestamp: new Date().toISOString(),
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
