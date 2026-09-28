import { supabase } from "../supabase.js";
export async function login(req, res) {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        return res.status(401).json({ Error: error.message });
    }
    const userId = data.user?.id;
    if (!userId) {
        return res.status(400).json({ message: `Não foi possível obter o ID do usuário` });
    }
    const { data: employee } = await supabase
        .from("users")
        .select("id, name, role")
        .eq("id", userId)
        .maybeSingle();
    if (employee) {
        return res.status(200).json({ message: "Login realizado com sucesso", user: employee, session: data.session });
    }
    const { data: customer } = await supabase
        .from('customer')
        .select('id, name, role')
        .eq("id", userId)
        .maybeSingle();
    if (customer) {
        return res.status(200).json({ message: "Login realizado com sucesso", user: customer, session: data.session });
    }
    return res.status(404).json({ message: "Perfil do usuário não encontrado" });
}
