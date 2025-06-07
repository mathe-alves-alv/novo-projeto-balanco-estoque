import { createClient } from "@supabase/supabase-js";

// Suas credenciais do novo projeto Supabase
const supabaseUrl = "https://dgppfpsdjjrjtrfxnarw.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRncHBmcHNkampyanRyZnhuYXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNTg0MzUsImV4cCI6MjA2NDgzNDQzNX0._gGDTOUAEeFT8MyGID-XLBP6NmjYV5b8MQVt_wmA7ZQ";

// Cria e exporta o cliente Supabase para ser usado em outras partes do app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
