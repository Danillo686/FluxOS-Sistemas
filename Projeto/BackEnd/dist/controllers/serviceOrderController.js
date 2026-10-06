import { supabaseAdmin } from "../supabase.js";
// Consulta usada pelo painel interno para listar as ordens existentes.
export const getServiceOrders = async (req, res) => {
    const { data, error } = await supabaseAdmin
        .from('service_orders')
        .select('*')
        .order('entry_date', { ascending: false });
    if (error) {
        return res.status(500).json({ message: 'Erro ao buscar ordens de serviço', error: error.message });
    }
    return res.status(200).json({ message: 'Ordens de serviço encontradas', data });
};
export const createServiceOrder = async (req, res) => {
    const { vehicle_id, 
    // attendant_id,
    technician_id, customer_report, notes, estimated_completion_date, total_value } = req.body;
    // O relato é obrigatório no formulário de abertura da ordem.
    if (!vehicle_id || !customer_report) {
        return res.status(400).json({ message: 'Veículo e descrição do problema são obrigatórios' });
    }
    if (!req.employee) {
        return res.status(403).json({ message: 'Funcionário não identificado' });
    }
    // Verifica o veículo no servidor após a autorização da rota.
    const { data: vehicle, error: vehicleError } = await supabaseAdmin
        .from('vehicles')
        .select('id_vehicles')
        .eq('id_vehicles', vehicle_id)
        .maybeSingle();
    if (vehicleError) {
        return res.status(500).json({ message: 'Erro ao verificar veículo', error: vehicleError.message });
    }
    if (!vehicle) {
        return res.status(404).json({ message: 'Veículo não encontrado' });
    }
    //Pegando estritamente a string da data (índice 0 do split)
    const entryDateString = new Date().toISOString().split("T")[0];
    const { data: serviceOrder, error: serviceOrderError } = await supabaseAdmin
        .from('service_orders')
        .insert({
        vehicle_id,
        attendant_id: req.employee.id,
        technician_id: technician_id || null,
        status: "open",
        customer_report,
        notes: notes || null,
        entry_date: entryDateString,
        estimated_completion_date: estimated_completion_date || null,
        total_value: total_value || null
    })
        .select()
        .single();
    if (serviceOrderError) {
        // Isso vai printar o erro completinho no terminal do seu VS Code / Servidor
        console.error("ERRO COMPLETO DO SUPABASE:", serviceOrderError);
        return res.status(500).json({
            message: 'Erro ao cadastrar ordem de serviço',
            error: serviceOrderError.message,
            code: serviceOrderError.code, // Código do erro do Postgres (ex: 23503)
            details: serviceOrderError.details
        });
    }
    return res.status(201).json({ message: 'Ordem de serviço criada com sucesso!', data: serviceOrder });
};
