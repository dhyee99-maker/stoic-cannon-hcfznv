import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "رابط_مشروعك_هنا";
const supabaseAnonKey = "مفتاح_مشروعك_هنا";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
