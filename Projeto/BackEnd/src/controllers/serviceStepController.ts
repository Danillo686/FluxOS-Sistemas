import { Request, Response } from "express"
import { supabaseAdmin } from "../supabase.js"

export const createServiceStep = async (
    req: Request,
    res: Response
): Promise<any> => {
    const {service_id, step_order, description} = req.body

    if (!Number.isSafeInteger(service_id) || service_id <= 0 || !Number.isSafeInteger(step_order) || step_order <= 0 || typeof description !== "string" || !description.trim()) {
        return res.status(400).json({message: 'Informe service_id, step_order e description válidos'})
    }

    const {data: service, error: serviceError} = await supabaseAdmin
    .from('services')
    .select('id_service')
    .eq('id_service', service_id)
    .maybeSingle()

    if (serviceError) {
        return res.status(500).json({message: 'Erro ao consultar serviço', error: serviceError.message})
    }

    if (!service) {
        return res.status(404).json({message: 'Serviço não encontrado'})
    }

    const {data, error} = await supabaseAdmin
    .from('service_steps')
    .insert({
        service_id,
        step_order,
        description: description.trim()
    })
    .select()
    .single()

    if (error) {
        if (error.code === '23505') {
            return res.status(409).json({message: 'Já existe uma etapa com essa ordem para este serviço'})
        }

        return res.status(500).json({message: 'Erro ao cadastrar etapa', error: error.message})
    }

    return res.status(201).json({message: 'Etapa cadastrada com sucesso!', data: data})

}

export const getServiceSteps = async (
    req: Request,
    res: Response
): Promise<any> => {
    const serviceId = Number(req.params.serviceId)

    if (!Number.isSafeInteger(serviceId) || serviceId <= 0) {
        return res.status(400).json({message: 'ID do serviço inválido'})
    }

    const {data: service, error: serviceError} = await supabaseAdmin
    .from('services')
    .select('id_service')
    .eq('id_service', serviceId)
    .maybeSingle()

    if (serviceError) {
        return res.status(500).json({message: 'Erro ao consultar serviço', error: serviceError.message})
    }

    if (!service) {
        return res.status(404).json({message: 'Serviço não encontrado'})
    }

    const {data, error} = await supabaseAdmin
    .from('service_steps')
    .select('*')
    .eq('service_id', serviceId)
    .order('step_order', { ascending : true})

    if (error) {
        return res.status(500).json({message: 'Erro ao buscar etapas', error: error.message})
    }

    return res.status(200).json({data: data})
}