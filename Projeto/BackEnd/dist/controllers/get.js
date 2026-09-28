import { supabase } from "../supabase.js";
export const get = async (req, res) => {
    const { data, error } = await supabase
        .from('users')
        .select('*');
    if (error) {
        return res.status(500).json({ Error: error.message });
    }
    return res.status(200).json({ message: 'GET feito com sucesso!', data: data });
};
