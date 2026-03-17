import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const cloudName = Deno.env.get('CLOUDINARY_CLOUD_NAME');
    const apiKey = Deno.env.get('CLOUDINARY_API_KEY');
    const apiSecret = Deno.env.get('CLOUDINARY_API_SECRET');

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error('Cloudinary credentials not configured');
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) throw new Error('No file provided');

    const folder = formData.get('folder') as string || 'portfolio';

    // Build Cloudinary upload
    const timestamp = Math.round(Date.now() / 1000).toString();
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;

    // Generate signature
    const encoder = new TextEncoder();
    const data = encoder.encode(paramsToSign + apiSecret);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const uploadForm = new FormData();
    uploadForm.append('file', file);
    uploadForm.append('api_key', apiKey);
    uploadForm.append('timestamp', timestamp);
    uploadForm.append('signature', signature);
    uploadForm.append('folder', folder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      { method: 'POST', body: uploadForm }
    );

    const result = await response.json();
    if (!response.ok) {
      throw new Error(`Cloudinary upload failed: ${JSON.stringify(result)}`);
    }

    return new Response(JSON.stringify({ url: result.secure_url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
