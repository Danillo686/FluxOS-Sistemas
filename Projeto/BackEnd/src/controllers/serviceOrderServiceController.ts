import { Request, Response } from "express"
import { supabaseAdmin } from "../supabase.js"

export const addServiceToOrder = async (
    req: Request,
    res: Response
): Promise<any> => {
    const { service_order_id, service_id } = req.body

    if (!Number.isSafeInteger(Number(service_order_id)) || Number(service_order_id) <= 0 || !Number.isSafeInteger(Number(service_id)) || Number(service_id) <= 0) {
        return res.status(400).json({message: "Informe ID válidos para a ordem de serviço"})
    }

    const {data: order, error: orderError} = await supabaseAdmin
    .from('service_orders')
    .select("id_service_orders, status")
    .eq("id_service_orders", Number(service_order_id))
    .maybeSingle()

    if (orderError) {
        return res.status(500).json({message: 'Erro ao consultar ordem', error: orderError.message})
    }

    if (!order) {
        return res.status(400).json({message: 'Ordem de serviço não encontrada'})
    }

     // Confirma que o serviço existe e está ativo.
    const { data: service, error: serviceError } = await supabaseAdmin
    .from("services")
    .select("id_service, name, price, active")
    .eq("id_service", Number(service_id))
    .maybeSingle()

    if (serviceError) {
        return res.status(500).json({message: 'Erro ao consultar serviço', error: serviceError.message})
    }

    if (!service || !service.active) {
        return res.status(404).json({message: 'Serviço não encontrado ou inativo'})
    }

    // Não adiciona serviços a uma ordem já finalizada.
    if (["completed", "cancelled"].includes(order.status)) {
        return res.status(409).json({message: 'Não é possível adicionar serviços a esta ordem'})
    }

        // Registra aassociação usando o preço do catálogo.
    const { data: orderService, error: insertError } = await supabaseAdmin
    .from("service_order_services")
    .insert({
        service_order_id: Number(service_order_id),
        service_id: Number(service_id),
        unit_value: service.price,
        status: "pending",
        added_by_technician: false
    })
    .select()
    .single()

    if (insertError) {
        console.error('Erro ao adicionar serviço: ', insertError)

        return res.status(500).json({message: "Erro ao adicionar serviço à ordem", error: insertError.message})
    }

    return res.status(201).json({message: "Serviço adicionado à ordem com sucesso!", data: orderService})
}


// Lista os serviços associados a uma ordem.
export const getOrderServices = async (
    req: Request,
    res: Response
): Promise<any> => {
    const orderId = Number(req.params.orderId)

    if (!Number.isSafeInteger(orderId) || orderId <= 0) {
        return res.status(400).json({message: 'ID da ordem inválido'})
    }

    const { data: orderServices, error } = await supabaseAdmin
    .from("service_order_services")
    .select("*")
    .eq("service_order_id", orderId)

    if (error) {
        return res.status(500).json({message: "Erro ao buscar serviços da ordem", error: error.message})
    }

    return res.status(200).json({
        message: "Serviços da ordem encontrados",
        data: orderServices
    })
}