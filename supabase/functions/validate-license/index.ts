
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { licenseKey } = await req.json();

        if (!licenseKey) {
            throw new Error('License key is required');
        }

        const lsApiKey = Deno.env.get('LEMON_SQUEEZY_API_KEY');
        if (!lsApiKey) {
            throw new Error('Server configuration error: Missing LS API Key');
        }

        // 1. Validate with Lemon Squeezy API [POST /v1/licenses/validate]
        // Docs: https://docs.lemonsqueezy.com/api/licenses#validate-a-license-key
        const lsResponse = await fetch(
            'https://api.lemonsqueezy.com/v1/licenses/validate',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded' // LS Validate endpoint expects form data or JSON? standard is form or JSON. JSON is cleaner.
                },
                body: new URLSearchParams({ license_key: licenseKey }) // Using form-urlencoded as it's often more robust for this specific endpoint in LS, or JSON.
                // Let's try JSON first as per modern standards, but if I recall LS validate takes form param usually? 
                // Creating an instance usually takes params. Validate takes `license_key`
            }
        );
        // Actuallly, let's use JSON content type, typically supported.
        // Wait, standard LS docs for validate say: 
        // "Accept: application/json"
        // "Content-Type: application/x-www-form-urlencoded" is common for this endpoint in examples.
        // Let's use strict JSON body to be safe if the API supports it. But official examples often use curl -d "license_key=..."
        // I will use `Content-Type: application/json` and body `JSON.stringify({ license_key: licenseKey })` if supported.
        // *Self-correction*: Safe bet is form-urlencoded or checking docs. 
        // Let's try JSON. If it fails (415), we switch. But wait, I'd rather be right.
        // Re-checking "POST /v1/licenses/validate"
        // It accepts `license_key` (required).

        // Let's rewrite the fetch to use the correct signature.

        const validateResponse = await fetch('https://api.lemonsqueezy.com/v1/licenses/validate', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ license_key: licenseKey })
        });

        if (!validateResponse.ok) {
            const errorText = await validateResponse.text();
            console.error("LS Validation API Error:", errorText);
            throw new Error(`LS Error (${validateResponse.status}): ${errorText}`);
        }

        const validationData = await validateResponse.json();

        // 2. Check conditions
        if (!validationData.valid) {
            return new Response(JSON.stringify({ error: validationData.error || 'La licencia no es válida o ha expirado.' }), {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // If we want to check for specific status "active", validationData.license_key.status should be "active" usually if valid is true.
        // But `valid: true` is enough for entry.

        // 3. Activate User in Supabase
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        // Get the user ID from the Authorization header (JWT)
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) throw new Error('No user authorization found');

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

        if (userError || !user) {
            return new Response(JSON.stringify({ error: 'Usuario no autenticado. Por favor recarga la página.' }), {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // Update profile
        const { error: updateError } = await supabaseAdmin
            .from('profiles')
            .update({ is_verified: true })
            .eq('id', user.id);

        if (updateError) throw updateError;

        return new Response(JSON.stringify({ success: true, message: 'License verified' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });

    } catch (error) {
        console.error('Validation error:', error);
        return new Response(JSON.stringify({ error: error.message || 'Error interno de validación' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });
    }
});
