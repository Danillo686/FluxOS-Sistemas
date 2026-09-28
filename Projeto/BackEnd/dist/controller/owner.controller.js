import { supabase } from "../supabase.js";
import bcrypt from 'bcrypt';
// const time = new Date() // Apenas para puxar horas, mês, dia, etc...
//Lista como base:
// [ data[0] -> Entra no dicionário abaixo
//     { data[0].nomeDoDadoQueDeseja (Ex: data[0].nome)
//         "id": 1
//         "cpf": "0000000000",
//         "nome": "X",
//         "senha": "123",
//         "email": "X@email.com",
//         "telefone": "00000000000"
//     }
// ]
// INSERT / POST
export const postOwner = async (req, res) => {
    const { cpf, nome, senha, email, telefone } = req.body; // Parametros do POST
    if (!cpf || !nome || !senha || !email || !telefone) {
        return res.status(400).json({ Error: 'Por favor, preencha todos os campos.' });
    }
    const senhaHash = await bcrypt.hash(senha, 10);
    // const cpfHash = await bcrypt.hash(cpf, 10) --> Cpf não poder Hash, pois será usado outras vezes
    const { data, error } = await supabase // data é sempre o resultado e error é o erro no supabase
        .from("Owner")
        .insert([{ cpf, nome, senha: senhaHash, email, telefone }])
        .select();
    if (error) {
        return res.status(500).json({ Error: error.message });
    }
    const time = new Date();
    return res.status(200).json({ message: `${nome} criado com sucesso! Seja bem-vindo, ${nome}!`, horario: `|${time.getHours()}-${time.getMinutes()}-${time.getSeconds()}:${time.getMilliseconds()}|`, date: `|${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}|` });
};
// GET
export const getOwner = async (req, res) => {
    const { data, error } = await supabase
        .from("Owner")
        .select('*');
    if (error) {
        return res.status(500).json({ Error: error.message });
    }
    const time = new Date();
    return res.status(200).json({ message: `GET Feito com sucesso`, data: data, horario: `|${time.getHours()}-${time.getMinutes()}-${time.getSeconds()}:${time.getMilliseconds()}|`, date: `|${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}|` });
};
// GET/:ID
export const getIdOwner = async (req, res) => {
    console.log("ENTROU NO GET ID");
    console.log("ID RECEBIDO:", req.params.id);
    const { id } = req.params;
    const { data, error } = await supabase
        .from("Owner")
        .select('*')
        .eq('id', id);
    if (error) {
        return res.status(500).json({ Error: error.message });
    }
    const time = new Date();
    return res.status(200).json({ message: `GET Feito com sucesso`, data: data, horario: `|${time.getHours()}-${time.getMinutes()}-${time.getSeconds()}:${time.getMilliseconds()}|`, date: `|${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}|` });
};
//UPDATE / PUT
export const putOwner = async (req, // id para ser o parametro da URL e fazer o UPDATE
res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from("Owner")
        .update(req.body) // Update direto no body
        .eq('id', id)
        .select();
    if (error) {
        return res.status(500).json({ Error: error.message });
    }
    const time = new Date();
    res.status(200).json({ message: `Update no/a ${data[0].nome} feito com sucesso!`, horario: `|${time.getHours()}-${time.getMinutes()}-${time.getSeconds()}:${time.getMilliseconds()}|`, date: `|${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}|` });
};
//DELETE / DEL
export const deletOwner = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from("Owner")
        .delete() //Deletar
        .eq("id", id)
        .select();
    if (error) {
        return res.status(500).json({ Error: error.message });
    }
    const time = new Date();
    return res.status(200).json({ message: `O Senhor/a ${data[0].nome} foi deletado com sucesso!`, horario: `|${time.getHours()}-${time.getMinutes()}-${time.getSeconds()}:${time.getMilliseconds()}|`, date: `|${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}|` });
};
//LOGIN / POST -->
export const loginOwner = async (req, // --> Parametros para o login se feito corretamente
res) => {
    console.log("ENTROU NO LOGIN");
    console.log("BODY:", req.body);
    const { cpf, nome, senha, email, telefone } = req.body;
    if (!cpf || !nome || !senha || !email || !telefone) {
        return res.status(500).json({ Error: 'Por favor, preencha todos os campos.' });
    }
    const { data, error } = await supabase
        .from('Owner')
        .select('*')
        .eq('cpf', cpf)
        .eq('nome', nome)
        .eq('email', email)
        .eq('telefone', telefone)
        .single(); //--> Para retornar apenas uma lista []
    if (error || !data) {
        return res.status(404).json({ Error: 'Conta não encontrada.' });
    }
    const senhaOwner = await bcrypt.compare(senha, data.senha); // --> Compara a senha do banco com a digitada, se estiver certa, passa
    if (!senhaOwner) {
        return res.status(500).json({ Error: 'Senha incorreta!' });
    }
    const time = new Date();
    return res.status(200).json({ message: `Bem-vindo, ${data.nome}! `, owner: { id: data.id, nome: data.nome, cpf: data.cpf, email: data.email, telefone: data.telefone } });
    // O owner é retornado assim para não retornar sua senha junto :)
};
