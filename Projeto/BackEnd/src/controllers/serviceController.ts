import { Request, Response } from "express"
import { supabaseAdmin } from "../supabase.js"

export const getService = async (
    req: Request,
    res: Response
): Promise<any> => {
    const {data, error} = await supabaseAdmin
    .from('services')
    .select('*')
    .order('name', { ascending: true })

    if (error) {
        return res.status(500).json({message: 'Erro ao fazer busca', error: error.message})
    }

    return res.status(200).json({message: 'Serviços encontrados!', data: data})
}

export const createService = async (
    req: Request,
    res: Response
): Promise<any> => {
    const {name, description, price} = req.body

    if (typeof name !== "string" || !name.trim() || typeof price !== "number" || !Number.isFinite(price) || price < 0) {
        return res.status(400).json({message: 'Informe um nome e um preço válido para o serviço'})
    }

    const {data: Service, error: ServiceError} = await supabaseAdmin
    .from('services')
    .insert({
        name: name.trim(),
        description: description || null,
        price
    })
    .select()
    .single()

    if (ServiceError) {
        console.log('Erro ao cadastrar serviço', ServiceError)
    
        return res.status(500).json({message: 'Erro ao cadastrar serviço', error: ServiceError})
    }

    return res.status(201).json({message: 'Serviço cadastrado com sucesso!', data: Service})
}