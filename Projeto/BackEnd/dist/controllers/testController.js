import { supabase } from "../supabase.js";
//Test é apenas par aver o que tem na tabela users :>
export const testDatabase = async (_req, res) => {
    const { data, error } = await supabase
        .from('users')
        .select('*');
    if (error) {
        return res.status(500).json({ Error: error.message });
    }
    return res.status(200).json({ message: 'Banco conectado...', data: data });
};
