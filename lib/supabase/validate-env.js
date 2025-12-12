/**
 * Environment Variable Validation
 * 
 * Validates that required Supabase environment variables are present
 * and provides helpful error messages if they're missing.
 */

/**
 * Validates Supabase environment variables
 * @throws {Error} If required environment variables are missing
 */
export function validateSupabaseEnv() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const missingVars = [];

    if (!supabaseUrl) {
        missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
    }

    if (!supabaseKey) {
        missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
    }

    if (missingVars.length > 0) {
        const errorMessage = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  MISSING SUPABASE CREDENTIALS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The following environment variables are missing:
${missingVars.map(v => `  ❌ ${v}`).join('\n')}

To fix this:

1. Create a .env.local file in the project root (if it doesn't exist)
2. Add your Supabase credentials:

   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

3. Get your credentials from:
   https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api

4. Restart your development server

For detailed setup instructions, see:
  📖 SUPABASE_SETUP.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `.trim();

        throw new Error(errorMessage);
    }

    return { supabaseUrl, supabaseKey };
}

/**
 * Checks if Supabase is configured (non-throwing version)
 * @returns {boolean} True if Supabase credentials are present
 */
export function isSupabaseConfigured() {
    return !!(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
}

/**
 * Gets Supabase credentials with validation
 * @returns {{ url: string, key: string }} Supabase credentials
 * @throws {Error} If credentials are missing
 */
export function getSupabaseCredentials() {
    const { supabaseUrl, supabaseKey } = validateSupabaseEnv();
    return {
        url: supabaseUrl,
        key: supabaseKey
    };
}
