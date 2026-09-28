import { supabase } from "../supabase.js";
export const createCustomer = async (req, res) => {
    const { name, cpf, zip_code, photo, phone, email, password } = req.body;
    if (!name || !cpf || !zip_code || !phone || !email || !password) {
        message: "Nome, CPF, CEP, telefone, email e senha são obrigatórios";
    }
    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
    });
    if (error) {
        return res.status(400).json({ message: 'Erro ao criar conta', error: error.message });
    }
    const userId = data.user.id;
    const { data: customer, error: customerError } = await supabase
        .from('customer')
        .insert({
        id_customer: userId,
        name: name,
        cpf: cpf,
        zip_code: zip_code,
        photo: photo,
        phone: phone,
        role: "customer"
    })
        .select()
        .single();
    if (customerError) {
        return res.status(500).json({ message: 'Conta criada no Auth, mas erro ao criar cliente', error: customerError.message });
    }
    return res.status(201).json({ message: "Cliente criado com sucesso", customer: customer });
};
