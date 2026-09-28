import { supabase } from "../supabase.js";
import bcrypt from 'bcrypt';
// POST / INSERT
export const postCustomer = async (req, res) => {
    const { cep, cpf, nome, email, senha } = req.body;
    if (!cep || !cpf || !nome || !email || !senha) {
        return res.status(500).json({ Error: "Por favor, preencha todos os campos." });
    }
    const senhaHash = await bcrypt.hash(senha, 10);
    // const cpfHash = await bcrypt.hash(cpf, 10)  --> Cpf não poder Hash, pois será usado outras vezes
    const { data, error } = await supabase
        .from('Customer')
        .insert([{ cep, cpf, nome, email, senha: senhaHash }])
        .select();
    if (error) {
        return res.status(500).json({ Error: error.message });
    }
    const time = new Date();
    return res.status(200).json({ message: `${nome} criado com sucesso! Seja bem-vindo, ${nome}!`, horario: `|${time.getHours()}-${time.getMinutes()}-${time.getSeconds()}:${time.getMilliseconds()}|`, date: `|${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}|` });
};
// GET
export const getCustomer = async (req, res) => {
    const { data, error } = await supabase
        .from('Customer')
        .select('*');
    if (error) {
        return res.status(500).json({ Error: error.message });
    }
    const time = new Date();
    return res.status(200).json({ message: `GET executado com sucesso! \n`, data: data, horario: `|${time.getHours()}-${time.getMinutes()}-${time.getSeconds()}:${time.getMilliseconds()}|`, date: `|${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}|` });
};
// GET/:ID
export const getIdCustomer = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('Customer')
        .select('*')
        .eq('id', id);
    if (error) {
        return res.status(500).json({ Error: error.message });
    }
    const time = new Date();
    return res.status(200).json({ message: `GET executado com sucesso! \n`, data: data, horario: `|${time.getHours()}-${time.getMinutes()}-${time.getSeconds()}:${time.getMilliseconds()}|`, date: `|${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}|` });
};
// UPDATE / PUT
export const putCustomer = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('Customer')
        .update(req.body)
        .eq('id', id)
        .select();
    if (error) {
        return res.status(500).json({ Error: error.message });
    }
    const time = new Date();
    return res.status(200).json({ message: `${data[0].nome} foi atulizado com sucesso! \n`, data: data, horario: `|${time.getHours()}-${time.getMinutes()}-${time.getSeconds()}:${time.getMilliseconds()}|`, date: `|${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}|` });
};
//DELETE / DEL
export const delCustomer = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('Customer')
        .delete()
        .eq('id', id)
        .select();
    if (error) {
        return res.status(500).json({ Error: error.message });
    }
    const time = new Date();
    return res.status(200).json({ message: `${data[0].nome} deletado com sucesso!`, data: data, horario: `|${time.getHours()}-${time.getMinutes()}-${time.getSeconds()}:${time.getMilliseconds()}|`, date: `|${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}|` });
};
