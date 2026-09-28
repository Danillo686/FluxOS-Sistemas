import { supabase } from "../supabase.js";
export async function registerCustomer(req, res) {
    const { email, password, name, cpf, phone, zip_code } = req.body;
    const { data, error } = await supabase.auth.signUp({ email, password }); //Criação da conta
    if (error) {
        return res.status(400).json({ Error: error.message });
    }
    const userId = data.user?.id; //Id criado pelo Auth  
    if (!userId) {
        return res.status(400).json({ message: "Não foi possível obter o ID do usuário" });
    }
    const { error: customerError } = await supabase
        .from('customer')
        .insert({ id: userId, name, cpf, phone, zip_code, role: "customer" }); // Deixar a role como cliente pois a tabela só recebe cliente
    if (customerError) {
        await supabase.auth.admin.deleteUser(userId); // Se der erro o auth deleta a cora na hora :^)
        return res.status(400).json({ Error: customerError.message });
    }
    return res.status(201).json({ message: "Cliente cadastrado com sucesso", id: userId });
}
