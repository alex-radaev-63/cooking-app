import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.YUMMM_SUPABASE_URL as string;
const supabaseKey = import.meta.env.YUMMM_SUPABASE_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);