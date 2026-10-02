import {Request, Response} from "express"
import {supabase, supabaseAdmin} from "../supabase.js" 

export const createServiceOrder = async (
    req: Request,
    res: Response
): Promise<any> => {
    const {
        vehicle_id,
        // attendant_id,
        technician_id,
        customer_report,
        notes,
        estimated_completion_date,
        total_value
    } = req.body

    if(!vehicle_id) {
        return res.status(400).json({message: 'Veículo e descrição do problema são obrigatórios'})
    }

    if (!req.employee) {
        return res.status(403).json({message: 'Funcionário não identificado'})
    }

    const {data: vehicle, error: vehicleError} = await supabase
    .from('vehicles')
    .select('id_vehicles')
    .eq('id_vehicles', vehicle_id)
    .maybeSingle()

    if (vehicleError) {
        return res.status(500).json({message: 'Erro ao verificar veículo', error: vehicleError.message})
    }

    if (!vehicle) {
        return res.status(404).json({message: 'Veículo não encontrado'})
    }

    //Pegando estritamente a string da data (índice 0 do split)
     const entryDateString = new Date().toISOString().split("T")[0]; 

    const {data: serviceOrder, error: serviceOrderError} = await supabaseAdmin
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
    .single()

    if (serviceOrderError) {
        // Isso vai printar o erro completinho no terminal do seu VS Code / Servidor
        console.error("ERRO COMPLETO DO SUPABASE:", serviceOrderError);

        return res.status(500).json({
            message: 'Erro ao cadastrar ordem de serviço', 
            error: serviceOrderError.message,
            code: serviceOrderError.code, // Código do erro do Postgres (ex: 23503)
            details: serviceOrderError.details
        })
    }

    return res.status(201).json({message: 'Ordem de serviço criada com sucesso!', data: serviceOrder })
} 