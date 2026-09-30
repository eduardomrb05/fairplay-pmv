import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://afhbsedyegnebcxnbrgo.supabase.co";
const supabaseAnonKey = 'sb_publishable_0bfbBMNcA30NfUc2SRn44Q_qOsEdiD0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)