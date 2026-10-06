import { Request, Response, NextFunction } from "express"
import { supabase, supabaseAdmin } from "../supabase.js"

// Valida o Bearer para rotas de clientes e funcionários.
async function getAuthenticatedUser(
    req: Request,
    res: Response,
): Promise<NonNullable<Request["user"]> | null> {
    const authorization = req.headers.authorization

    if (!authorization) {
        res.status(401).json({message: 'Token não informado'})
        return null
    }

    const token = authorization.replace(/^Bearer\s+/i, '').trim()

    const {data, error} = await supabase.auth.getUser(token)
    
    if (error || !data.user) {
        console.error('Falha ao validar token Supabase:', {
            message: error?.message,
            status: error?.status,
            code: error?.code
        })
        res.status(401).json({message: 'Token inválido ou expirado'})
        return null
    }

    return data.user
}

export const tokenAuthMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const user = await getAuthenticatedUser(req, res)
    if (!user) return

    req.user = user
    next()
}

// Busca o perfil de funcionário após validar o token, sem depender do RLS anônimo.
export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const user = await getAuthenticatedUser(req, res)
    if (!user) return

    const {data: employee, error: employeeError} = await supabaseAdmin
    .from('users')
    .select('id_users, name, role, active')
    .eq('id_users', user.id)
    .maybeSingle()

    if (employeeError) {
        res.status(500).json({message: 'Erro ao buscar usuário', error: employeeError.message})
        return
    }

    if (!employee) {
        res.status(403).json({message: 'Usuário não é funcionário da empresa'})
        return
    }

    if (!employee.active) {
        res.status(403).json({message: 'Usuário está inativo'})
        return
    }

    req.user = user

    req.employee = {
        id: employee.id_users,
        name: employee.name,
        role: employee.role,
        active: employee.active
    }

    next()
}