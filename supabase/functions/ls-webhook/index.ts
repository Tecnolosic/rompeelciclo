
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { crypto } from "https://deno.land/std@0.177.0/crypto/mod.ts";

console.log("Lemon Squeezy Webhook loaded");

serve(async (req) => {
    try {
        if (req.method !== "POST") {
            return new Response("Method not allowed", { status: 405 });
        }

        const secret = Deno.env.get("LEMON_SQUEEZY_WEBHOOK_SECRET");
        if (!secret) {
            console.error("Missing LEMON_SQUEEZY_WEBHOOK_SECRET");
            return new Response("Server Configuration Error", { status: 500 });
        }

        // Get the raw body as text for verification
        const rawBody = await req.text();
        const hmac = req.headers.get("x-signature");

        if (!hmac) {
            return new Response("No signature provided", { status: 401 });
        }

        // Verify signature
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
            "raw",
            encoder.encode(secret),
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["verify"]
        );

        const verified = await crypto.subtle.verify(
            "HMAC",
            key,
            hexToUint8Array(hmac),
            encoder.encode(rawBody)
        );

        if (!verified) {
            console.error("Invalid signature");
            return new Response("Invalid signature", { status: 401 });
        }

        const payload = JSON.parse(rawBody);
        const { meta, data } = payload;

        if (meta.event_name === "order_created") {
            const email = data.attributes.user_email;
            console.log(`Processing order for: ${email}`);

            // Initialize Supabase Admin Client
            const supabaseAdmin = createClient(
                Deno.env.get("SUPABASE_URL") ?? "",
                Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
            );

            // Find user profile by email (assuming email is unique and linked to profile)
            // Note: This relies on the user already being signed up with that email OR
            // we update the profile if exists. Ideally, we match on email.
            // Since profiles table might not have email directly (it's in auth.users), 
            // we might need to find the user ID from auth.users via RPC or if profiles table has it.
            // Based on previous context, profiles is keyed by user_id. 
            // We'll search in auth.users first if possible, but Edge Functions have access to auth admin.

            const { data: users, error: userError } = await supabaseAdmin.auth.admin.listUsers();

            if (userError) {
                console.error("Error listing users:", userError);
                return new Response("Error finding user", { status: 500 });
            }

            const user = users.users.find(u => u.email === email);

            if (user) {
                console.log(`Found user ID: ${user.id}`);

                // Update profile
                const { error: updateError } = await supabaseAdmin
                    .from("profiles")
                    .update({ is_verified: true })
                    .eq("id", user.id);

                if (updateError) {
                    console.error("Error updating profile:", updateError);
                    return new Response("Error updating profile", { status: 500 });
                }

                console.log("Profile updated successfully");
            } else {
                console.warn(`No user found for email: ${email}. They might sign up later.`);
                // Optional: Store a "pending purchases" table if desired, but for now we rely on them using the same email
            }
        }

        return new Response(JSON.stringify({ received: true }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        console.error("Webhook error:", error.message);
        return new Response(`Webhook Error: ${error.message}`, { status: 400 });
    }
});

// Helper to convert hex string to Uint8Array for signature verification
function hexToUint8Array(hexString: string) {
    return new Uint8Array(
        hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
    );
}
