import { supabase } from "../supabase.js";
export const getCustomer = async (req, res) => {
    const { data, error } = await supabase
        .from('customer')
        .select('*');
    if (error) {
        return res.status(500).json({ Error: error.message });
    }
    return res.status(200).json({ message: 'GET customer feito com sucesso!', data: data });
};
