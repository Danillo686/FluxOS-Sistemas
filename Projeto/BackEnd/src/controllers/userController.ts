import { Request, Response } from "express"
import { supabaseAdmin } from "../supabase.js"

export const createUser = async (
    req: Request,
    res: Response,
):Promise<any> => {
    const {name, email, password, role} = req.body

    if (!name || !email || !password || !role) {
        return res.status(400).json({message: 'Nome, email, senha e role são obrigatórios'})
    }

    const {data, error} = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true
    })
    
    if (error) {
        return res.status(400).json({message: 'Error ao criar conta', error: error.message})
    }

    const userId = data.user.id

    const {data: employee, error: employeeError} = await supabaseAdmin
    .from('users')
    .insert({
        id_users: userId,
        name: name,
        role: role,
        active: true
    })
    .select()
    .single()

    if (employeeError) {
        // Remove a conta Auth se o perfil não for criado, evitando funcionários sem role vinculada.
        const {error: cleanupError} = await supabaseAdmin.auth.admin.deleteUser(userId)
        return res.status(500).json({
            message: cleanupError
                ? 'Falha ao criar o perfil e remover a conta incompleta'
                : 'Cadastro cancelado porque não foi possível criar o perfil do funcionário',
            error: employeeError.message,
            cleanupError: cleanupError?.message
        })
    }

    return res.status(201).json({message: 'Usuário criado com sucesso', user: employee})
}

//FLUXO: 
/*requisição
    ↓
pega name/email/password/role
    ↓
verifica se veio tudo
    ↓
descobre o role de quem está criando
    ↓
verifica permissão
    ↓
cria conta no Supabase Auth
    ↓
pega o UUID criado
    ↓
cria o perfil em users
    ↓
201 Created
*/