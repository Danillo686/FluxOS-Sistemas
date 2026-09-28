import { supabase } from "../supabase.js";
import { generateUniqueCode } from "../utils/generateUniqueCode.js";
export async function register(req, res) {
    const { email, password, name, cpf, phone, zip_code } = req.body; //--> desestruturação
    // if (!zip_code || !cpf)
    const security_code = await generateUniqueCode();
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
        return res.status(500).json({ Error: error.message });
    }
    const userId = data.user?.id;
    if (!userId) {
        return res.status(400).json({ message: `Não foi possível obter o ID do usuário` });
    }
    console.log("Service Key carregada:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { data: testUser, error: testError } = await supabase.auth.admin.getUserById(userId);
    console.log("Admin API:", {
        funcionou: !testError,
        erro: testError?.message
    });
    //INSERT
    const { error: profileError } = await supabase
        .from('users')
        .insert({ id: userId, name, cpf, phone, zip_code, security_code, role: "cliente" });
    if (profileError) {
        await supabase.auth.admin.deleteUser(userId); //Deletar o User caso de erro
        return res.status(400).json({ message: profileError.message });
    }
    return res.status(200).json({ message: `Usuário cadastrado com sucesso`, id: userId });
}
