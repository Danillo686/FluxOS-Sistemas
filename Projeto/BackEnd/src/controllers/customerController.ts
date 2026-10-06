import { Request, Response } from "express"
import { supabaseAdmin } from "../supabase.js"

export const createCustomer = async (
    req: Request,
    res: Response
): Promise<any> => {

    const {
        name,
        cpf,
        zip_code,
        photo,
        phone,
        email,
        password
    } = req.body

    if (!name || !cpf || !zip_code || !phone || !email || !password) {
        return res.status(400).json({message: "Nome, CPF, CEP, telefone, email e senha são obrigatórios"})
    }

    // Armazena CPF, CEP e telefone apenas com dígitos para respeitar os limites das colunas.
    const cpfDigits = String(cpf).replace(/\D/g, '')
    const zipCodeDigits = String(zip_code).replace(/\D/g, '')
    const phoneDigits = String(phone).replace(/\D/g, '')

    if (cpfDigits.length !== 11) {
        return res.status(400).json({message: 'CPF deve conter exatamente 11 dígitos'})
    }

    if (zipCodeDigits.length !== 8) {
        return res.status(400).json({message: 'CEP deve conter exatamente 8 dígitos'})
    }

    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
        return res.status(400).json({message: 'Telefone deve conter 10 ou 11 dígitos'})
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true
    })

    if (error) {
        return res.status(400).json({message: 'Erro ao criar conta', error: error.message})
    }

    const userId = data.user.id

    const {data: customer, error: customerError} = await supabaseAdmin
    .from('customer')
    .insert({
        id_customer: userId,
        name: name,
        cpf: cpfDigits,
        zip_code: zipCodeDigits,
        photo: photo,
        phone: phoneDigits,
        role: "customer"
    })
    .select()
    .single()

    if (customerError) {
        // Remove a conta Auth se o perfil não for criado, evitando clientes sem perfil vinculado.
        const {error: cleanupError} = await supabaseAdmin.auth.admin.deleteUser(userId)
        return res.status(500).json({
            message: cleanupError
                ? 'Falha ao criar o perfil e remover a conta incompleta'
                : 'Cadastro cancelado porque não foi possível criar o perfil do cliente',
            error: customerError.message,
            cleanupError: cleanupError?.message
        })
    }

    return res.status(201).json({message: "Cliente criado com sucesso", customer: customer})
}