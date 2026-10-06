import { Request, Response } from "express"
import { supabaseAdmin } from "../supabase.js"

export const createVehicle = async (
    req: Request,
    res: Response
): Promise<any> => {

    const {
        customer_id, // Pode vir o ID
        name,        // Ou o nome
        phone,       // Ou o telefone
        plate,
        model,
        brand
    } = req.body

    // Validação básica: precisa de pelo menos uma forma de identificar o cliente + os dados do carro
    if ((!customer_id && !name && !phone) || !plate || !model || !brand) {
        return res.status(400).json({ 
            message: 'É necessário informar o Cliente (ID, Nome ou Telefone), além de placa, modelo e marca do veículo.' 
        })
    }

    // Consulta feita no servidor após a autorização da rota, sem depender do RLS anônimo.
    // 1. MONTA A BUSCA DINÂMICA DO CLIENTE
    let query = supabaseAdmin.from('customer').select('id_customer')

    if (customer_id) {
        // Se mandou o ID, busca direto de forma precisa
        query = query.eq('id_customer', customer_id)
    } else {
        // Se não mandou ID, cria uma busca condicional (OR) usando Nome ou Telefone
        const orConditions: string[] = []
        if (name) orConditions.push(`name.ilike.%${name}%`) // ilike ignora maiúsculas/minúsculas
        if (phone) orConditions.push(`phone.eq.${phone}`)
        
        query = query.or(orConditions.join(','))
    }

    // Executa a busca do cliente no banco
    const { data: customers, error: customerError } = await query

    if (customerError) {
        return res.status(500).json({ message: 'Erro ao verificar cliente', error: customerError.message })
    }

    // 2. VALIDAÇÕES DOS RESULTADOS ENCONTRADOS
    if (!customers || customers.length === 0) {
        return res.status(404).json({ message: 'Cliente não encontrado com os dados informados.' })
    }

    if (customers.length > 1) {
        return res.status(400).json({ 
            message: 'Mais de um cliente foi encontrado com esse nome/telefone. Por favor, utilize o ID do cliente para maior precisão.' 
        })
    }

    // Acessa a posição 0 do array de resultados para pegar o ID único do cliente
    const finalCustomerId = customers[0].id_customer

    // Gravação feita no servidor depois de confirmar o cliente.
    // 3. CADASTRA O VEÍCULO COM O ID CORRETO VINCULADO
    const { data: vehicle, error: vehicleError } = await supabaseAdmin
    .from('vehicles')
    .insert({
        customer_id: finalCustomerId, 
        plate,
        model,
        brand
    })
    .select()
    .single()

    if (vehicleError) {
        return res.status(500).json({ message: 'Erro ao cadastrar veículo', error: vehicleError.message })
    }

    return res.status(201).json({ message: 'Veículo cadastrado com sucesso!', vehicle })
}
