import { supabase } from "../supabase.js";
// ==========================================
// 1. CUSTOMERS
// ==========================================
// Buscar todos os clientes
export const getCustomers = async (req, res) => {
    const { data, error } = await supabase.from('customer').select('*');
    if (error)
        return res.status(500).json({ Error: error.message });
    return res.status(200).json({ message: 'GET customer feito com sucesso!', data });
};
// Buscar cliente por ID
export const getCustomerById = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('customer').select('*').eq('id_customer', id).single();
    if (error)
        return res.status(500).json({ Error: error.message });
    return res.status(200).json({ message: 'Cliente encontrado!', data });
};
//Buscar pelo nome
export const getCustomerByName = async (req, res) => {
    const { name } = req.params;
    const { data, error } = await supabase.from('customer').select('*').eq('name', name).single();
    if (error)
        return res.status(500).json({ Error: error.message });
    return res.status(200).json({ message: 'Cliente encontrado!', data });
};
// ==========================================
// 2. USERS / EMPRESAS
// ==========================================
// Buscar todos os usuários
export const getUsers = async (req, res) => {
    const { data, error } = await supabase.from('users').select('*');
    if (error)
        return res.status(500).json({ Error: error.message });
    return res.status(200).json({ message: 'GET feito com sucesso!', data });
};
// Buscar usuário por ID
export const getUserById = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('users').select('*').eq('id_users', id).single();
    if (error)
        return res.status(500).json({ Error: error.message });
    return res.status(200).json({ message: 'Usuário encontrado!', data });
};
//Buscar pelo nome
export const getUserByName = async (req, res) => {
    const { name } = req.params;
    const { data, error } = await supabase.from('users').select('*').eq('name', name).single();
    if (error)
        return res.status(500).json({ Error: error.message });
    return res.status(200).json({ message: 'Usuário encontrado!', data });
};
// ==========================================
// 3. VEÍCULOS (Já deixando pronto se precisar)
// ==========================================
// Buscar todos os veículos
export const getVehicles = async (req, res) => {
    const { data, error } = await supabase.from('vehicles').select('*');
    if (error)
        return res.status(500).json({ Error: error.message });
    return res.status(200).json({ message: 'GET veículos feito com sucesso!', data });
};
// Buscar veículo por ID
export const getVehicleById = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('vehicles').select('*').eq('id_vehicles', id).single();
    if (error)
        return res.status(500).json({ Error: error.message });
    return res.status(200).json({ message: 'Veículo encontrado!', data });
};
// Buscar veículo por PLACA
export const getVehicleByPlate = async (req, res) => {
    const { plate } = req.params;
    const { data, error } = await supabase.from('vehicles').select('*').eq('plate', plate).single();
    if (error)
        return res.status(500).json({ Error: error.message });
    return res.status(200).json({ message: 'Veículo encontrado pela placa!', data });
};
// Buscar pelo modelo
export const getVehicleByModel = async (req, res) => {
    const { model } = req.params;
    const { data, error } = await supabase.from('vehicles').select('*').eq('model', model).single();
    if (error)
        return res.status(500).json({ Error: error.message });
    return res.status(200).json({ message: 'Veículo encontrado pelo modelo!', data });
};
