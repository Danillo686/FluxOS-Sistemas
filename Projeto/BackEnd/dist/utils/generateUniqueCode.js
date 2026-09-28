import { supabase } from '../supabase.js';
import { generateCode } from './generateCode.js';
export async function generateUniqueCode() {
    let security_code = generateCode(); //não pode ser const pq o valor pode ser igual e deve mudar dps
    while (true) {
        const { data: existingCode, error } = await supabase //Dando o valor de "Data" á "existingCode" ou seja "codigoExistente"
            .from('users')
            .select('id')
            .eq('security_code', security_code);
        if (error) {
            throw new Error(error.message);
        }
        if (existingCode.length === 0) {
            return security_code;
        }
        security_code = generateCode();
    }
}
