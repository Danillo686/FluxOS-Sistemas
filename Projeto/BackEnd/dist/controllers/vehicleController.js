import { supabase } from "../supabase.js";
export const createVehicle = async (req, res) => {
    const { customer_id, plate, model, brand } = req.body;
    if (!customer_id || !plate || !model || !brand) {
        return res.status(400).json({ message: 'Cliente, placa, modelo e marca são obrigatórios' });
    }
    const { data: customer, error: customerError } = await supabase
        .from('customer')
        .select('id_customer')
        .eq('id_customer', customer_id)
        .maybeSingle();
    if (customerError) {
        return res.status(500).json({ message: 'Erro ao verificar cliente', error: customerError.message });
    }
    if (!customer) {
        return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    const { data: vehicle, error: vehicleError } = await supabase
        .from('vehicles')
        .insert({
        customer_id,
        plate,
        model,
        brand
    })
        .select()
        .single();
    if (vehicleError) {
        return res.status(500).json({ message: 'Error ao cadastrar', error: vehicleError.message });
    }
    return res.status(201).json({ message: 'Veículo cadastrado com sucesso!', vehicle });
};
