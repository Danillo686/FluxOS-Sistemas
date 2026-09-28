import { NextFunction, Request, Response } from "express"
import { supabase } from "../supabase.js"

export const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
):Promise<any> => {
    const {name, email, password, role} = req.body

    if (!name || !email || !password || !role) {
        return res.status(400).json({message: 'Nome, email, senha e role são obrigatórios'})
    }

    const {data, error} = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
    })
    
    if (error) {
        return res.status(400).json({message: 'Error ao criar conta', error: error.message})
    }

    const userId = data.user.id

    const {data: employee, error: employeeError} = await supabase
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
        return res.status(500).json({message: 'Conta criada no Auth, mas erro ao criar perfil', error: employeeError.message})
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