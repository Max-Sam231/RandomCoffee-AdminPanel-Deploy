// здесь определяем клиент для взаимодействия с Supabase

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gfjmykbjzcsilelaysme.supabase.co'; // Project URL
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdmam15a2JqemNzaWxlbGF5c21lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzNTM3NzMsImV4cCI6MjA0NzkyOTc3M30.feK4-kHSz9ml1dLCneP3oJsuDog9um6PusVLDp1-Oqg'; // API Key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
