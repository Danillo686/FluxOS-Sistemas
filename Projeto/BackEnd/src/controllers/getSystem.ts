// src/controllers/getControllers.ts
import { Request, Response } from "express";
import { supabaseAdmin } from "../supabase.js"; // Mantemos o uso da Anon Key para respeitar o RLS

// ==========================================
// 1. CUSTOMERS
// ==========================================

// Buscar todos os clientes (Usa Anon Key - Seguro)
export const getCustomers = async (req: Request, res: Response): Promise<any> => {
    const { data, error } = await supabaseAdmin.from('customer').select('*');

    if (error) return res.status(500).json({ Error: error.message });
    return res.status(200).json({ message: 'GET customer feito com sucesso!', data });
};

// Buscar cliente por ID
export const getCustomerById = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin.from('customer').select('*').eq('id_customer', id).maybeSingle(); // .maybeSingle evita estourar erro se não achar nada

    if (error) return res.status(500).json({ Error: error.message });
    if (!data) return res.status(404).json({ message: 'Cliente não encontrado' });
    return res.status(200).json({ message: 'Cliente encontrado!', data });
};

// Buscar cliente pelo nome (CORRIGIDO: ilike para permitir buscas parciais sem quebrar se houver nomes repetidos)
export const getCustomerByName = async (req: Request, res: Response): Promise<any> => {
    const { name } = req.params;
    const { data, error } = await supabaseAdmin.from('customer').select('*').ilike('name', `%${name}%`);

    if (error) return res.status(500).json({ Error: error.message });
    return res.status(200).json({ message: 'Resultados da busca por nome!', data });
};

// ==========================================
// 2. USERS / EMPRESAS
// ==========================================

// Buscar todos os usuários funcionários
export const getUsers = async (req: Request, res: Response): Promise<any> => {
    const { data, error } = await supabaseAdmin.from('users').select('*');

    if (error) return res.status(500).json({ Error: error.message });
    return res.status(200).json({ message: 'GET feito com sucesso!', data });
};

// Buscar usuário funcionário por ID
export const getUserById = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin.from('users').select('*').eq('id_users', id).maybeSingle();

    if (error) return res.status(500).json({ Error: error.message });
    if (!data) return res.status(404).json({ message: 'Usuário não encontrado' });
    return res.status(200).json({ message: 'Usuário encontrado!', data });
};

// Buscar usuário funcionário pelo nome (CORRIGIDO: ilike para evitar quebra com registros duplicados)
export const getUserByName = async (req: Request, res: Response): Promise<any> => {
    const { name } = req.params;
    const { data, error } = await supabaseAdmin.from('users').select('*').ilike('name', `%${name}%`);

    if (error) return res.status(500).json({ Error: error.message });
    return res.status(200).json({ message: 'Resultados da busca por usuário!', data });
};


// ==========================================
// 3. VEÍCULOS
// ==========================================

// Buscar todos os veículos
export const getVehicles = async (req: Request, res: Response): Promise<any> => {
    const { data, error } = await supabaseAdmin.from('vehicles').select('*');

    if (error) return res.status(500).json({ Error: error.message });
    return res.status(200).json({ message: 'GET veículos feito com sucesso!', data });
};

// Buscar veículo por ID
export const getVehicleById = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin.from('vehicles').select('*').eq('id_vehicles', id).maybeSingle();

    if (error) return res.status(500).json({ Error: error.message });
    if (!data) return res.status(404).json({ message: 'Veículo não encontrado' });
    return res.status(200).json({ message: 'Veículo encontrado!', data });
};

// Buscar veículo por PLACA (Mantido single pois placa costuma ser única no sistema)
export const getVehicleByPlate = async (req: Request, res: Response): Promise<any> => {
    const { plate } = req.params;
    const { data, error } = await supabaseAdmin.from('vehicles').select('*').eq('plate', plate).maybeSingle();

    if (error) return res.status(500).json({ Error: error.message });
    if (!data) return res.status(404).json({ message: 'Nenhum veículo encontrado com essa placa' });
    return res.status(200).json({ message: 'Veículo encontrado pela placa!', data });
};

// Buscar pelo modelo (CORRIGIDO: mudado para lista com ilike para não estourar erro se houver dois Unos ou dois Onix)
export const getVehicleByModel = async (req: Request, res: Response): Promise<any> => {
    const { model } = req.params;
    const { data, error } = await supabaseAdmin.from('vehicles').select('*').ilike('model', `%${model}%`);

    if (error) return res.status(500).json({ Error: error.message });
    return res.status(200).json({ message: 'Veículos encontrados pelo modelo!', data });
};
