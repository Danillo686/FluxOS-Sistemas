import { supabase } from "../supabase.js";
import bcrypt from 'bcrypt';
//POST / INSERT
const time = new Date();
export const postAttendant = async (req, res) => {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
        return res.status(500).json({ Error: 'Por favor, preencha todos os campos.' });
    }
    const senhaHash = await bcrypt.hash(senha, 10);
    const { data, error } = await supabase
        .from('Attendant')
        .insert([{ nome, email, senha: senhaHash }])
        .select();
    if (error) {
        return res.status(500).json({ Error: error.message });
    }
    return res.status(200).json({ message: `${nome} criado com sucesso! Seja bem-vindo, ${nome}!`, horario: `|${time.getHours()}-${time.getMinutes()}-${time.getSeconds()}:${time.getMilliseconds()}|`, date: `|${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}|` });
};
// GET
export const getAttendant = async (req, res) => {
    const { data, error } = await supabase
        .from('Attendant')
        .select('*');
    if (error) {
        return res.status(500).json({ Error: error.message });
    }
    return res.status(200).json({ message: `GET executado com sucesso! \n`, data: data, horario: `|${time.getHours()}-${time.getMinutes()}-${time.getSeconds()}:${time.getMilliseconds()}|`, date: `|${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}|` });
};
// GET/:ID
export const getIdAttendant = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('Attendant')
        .select('*')
        .eq('id', id);
    if (error) {
        return res.status(500).json({ Error: error.message });
    }
    return res.status(200).json({ message: `GET executado com sucesso! \n`, data: data, horario: `|${time.getHours()}-${time.getMinutes()}-${time.getSeconds()}:${time.getMilliseconds()}|`, date: `|${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}|` });
};
//UPDATE / PUT
export const putAttendant = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('Attendant')
        .update(req.body)
        .eq('id', id)
        .select();
    if (error) {
        return res.status(500).json({ Error: error.message });
    }
    // const nome = data[0].nome
    return res.status(200).json({ message: `${data[0].nome} foi atulizado com sucesso! \n`, data: data, horario: `|${time.getHours()}-${time.getMinutes()}-${time.getSeconds()}:${time.getMilliseconds()}|`, date: `|${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}|` });
};
//DELETE DEL
export const delAttendant = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('Attendant')
        .delete()
        .eq('id', id)
        .select();
    if (error) {
        return res.status(500).json({ Error: error.message });
    }
    return res.status(200).json({ message: `${data[0].nome} deletado com sucesso!`, data: data, horario: `|${time.getHours()}-${time.getMinutes()}-${time.getSeconds()}:${time.getMilliseconds()}|`, date: `|${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}|` });
};
