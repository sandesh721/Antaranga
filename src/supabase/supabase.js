import { createClient } from '@supabase/supabase-js';


const supabaseUrl = 'https://uzbcnkeihbforjogyyfn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6YmNua2VpaGJmb3Jqb2d5eWZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMjQxNDg5OCwiZXhwIjoyMDM3OTkwODk4fQ.AALnlD-5FJek2s91oL_aw2okJw2a_zFe0vTywP4y1ao';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
