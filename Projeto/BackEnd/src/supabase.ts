import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv'

dotenv.config()

// O "!" no final avisa ao TypeScript: "Eu garanto que essa string vai existir"
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  throw new Error("Chaves do Supabase não encontradas no arquivo .env!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
//