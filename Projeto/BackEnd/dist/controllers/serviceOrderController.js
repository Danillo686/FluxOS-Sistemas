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
    const { vehicle_id, technician_id, customer_report, notes, estimated_completion_date } = req.body;
    // O relato é obrigatório no formulário de abertura da ordem.
    if (vehicle_id === undefined || vehicle_id === null || vehicle_id === "" || !Number.isSafeInteger(Number(vehicle_id)) || Number(vehicle_id) <= 0) {
        return res.status(400).json({ message: 'Por favor, informe um ID válido!' });
    }
    if (typeof customer_report !== "string" || !customer_report.trim()) {
        return res.status(400).json({ message: 'A descrição do problema é obrigatória' });
    }
    if (!req.employee) {
        return res.status(403).json({ message: 'Funcionário não identificado' });
    }
    // Verifica o veículo no servidor após a autorização da rota.
    const { data: vehicle, error: vehicleError } = await supabaseAdmin
        .from('vehicles')
        .select('id_vehicles')
        .eq('id_vehicles', Number(vehicle_id))
        .maybeSingle();
    if (vehicleError) {
        return res.status(500).json({ message: 'Erro ao verificar veículo', error: vehicleError.message });
    }
    if (!vehicle) {
        return res.status(404).json({ message: 'Veículo não encontrado' });
    }
    const { data: serviceOrder, error: serviceOrderError } = await supabaseAdmin
        .from('service_orders')
        .insert({
        vehicle_id: Number(vehicle_id),
        attendant_id: req.employee.id,
        technician_id: technician_id || null,
        status: "open",
        customer_report: customer_report.trim(),
        notes: notes || null,
        estimated_completion_date: estimated_completion_date || null
    })
        .select()
        .single();
    if (serviceOrderError) {
        console.error("Errro ao cadastrar ordem de serviço", serviceOrderError);
        return res.status(500).json({
            message: 'Erro ao cadastrar ordem de serviço',
            error: serviceOrderError.message,
            code: serviceOrderError.code, // Código do erro do Postgres (ex: 23503)
            details: serviceOrderError.details
        });
    }
    return res.status(201).json({ message: 'Ordem de serviço criada com sucesso!', data: serviceOrder });
};
