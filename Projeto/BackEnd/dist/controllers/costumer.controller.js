import { supabase } from "../supabase.js";
import bcrypt from 'bcrypt';
const time = new Date();
// POST / INSERT
export const postCostumer = async (req, res) => {
    const { cep, cpf, nome, email, senha } = req.body;
    if (!cep || !cpf || !nome || !email || !senha) {
        return res.status(500).json({ Error: "Por favor, preencha todos os campos." });
    }
    const senhaHash = await bcrypt.hash(senha, 10);
    const cpfHash = await bcrypt.hash(cpf, 10);
    const { data, error } = await supabase
        .from('Custumer')
        .insert([{ cep, cpf: cpfHash, nome, email, senha: senhaHash }])
        .select();
    if (error) {
        return res.status(500).json({ Error: error.message });
    }
    return res.status(200).json({ message: `${nome} criado com sucesso! Seja bem-vindo, ${nome}!`, horario: `|${time.getHours()}-${time.getMinutes()}-${time.getSeconds()}:${time.getMilliseconds()}|`, date: `|${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}|` });
};
// GET
export const getCostumer = async (req, res) => {
    const { data, error } = await supabase
        .from('Costumer')
        .select('*');
    if (error) {
        return res.status(500).json({ Error: error.message });
    }
    return res.status(200).json({ message: `GET executado com sucesso! \n`, data: data, horario: `|${time.getHours()}-${time.getMinutes()}-${time.getSeconds()}:${time.getMilliseconds()}|`, date: `|${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}|` });
};
// GET/:ID
export const getIdCostumer = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('Costumer')
        .select('*')
        .eq('id', id);
    if (error) {
        return res.status(500).json({ Error: error.message });
    }
    return res.status(200).json({ message: `GET executado com sucesso! \n`, data: data, horario: `|${time.getHours()}-${time.getMinutes()}-${time.getSeconds()}:${time.getMilliseconds()}|`, date: `|${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}|` });
};
// UPDATE / PUT
export const putCostumer = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('Costumer')
        .update('req.body')
        .eq('id', id)
        .select();
    if (error) {
        return res.status(500).json({ Error: error.message });
    }
    return res.status(200).json({ message: `${data[0].nome} foi atulizado com sucesso! \n`, data: data, horario: `|${time.getHours()}-${time.getMinutes()}-${time.getSeconds()}:${time.getMilliseconds()}|`, date: `|${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}|` });
};
//DELETE / DEL
export const delCostumer = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('Costumer')
        .delete()
        .eq('id', id)
        .select();
    if (error) {
        return res.status(500).json({ Error: error.message });
    }
    return res.status(200).json({ message: `${data[0].nome} deletado com sucesso!`, data: data, horario: `|${time.getHours()}-${time.getMinutes()}-${time.getSeconds()}:${time.getMilliseconds()}|`, date: `|${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}|` });
};
