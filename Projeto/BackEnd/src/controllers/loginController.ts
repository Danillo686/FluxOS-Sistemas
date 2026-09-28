import { Request, Response } from "express"
import { supabase } from "../supabase.js"

export const login = async (
    req: Request,
    res: Response
): Promise<any> => {
    const {email, password} = req.body

    if (!email || !password) {
        return res.status(400).json({message:'Email e senha são obrigatórios'})
    }

    const {data, error} = await supabase.auth.signInWithPassword({
        email, password
    })

    if (error) {
        return res.status(401).json({message: "Email ou senha inválidos"})
    }

    const userId = data.user.id

    const {data: employee, error: employeeError} = await supabase
    .from ('users')
    .select('id_users, name, role, active')
    .eq('id_users', userId)
    .maybeSingle()

    if (employeeError) {
        return res.status(500).json({message: 'Erro ao procurar usuário', error: employeeError.message})
    }

    console.log("=== TESTE DE LOGIN ===") // Só um teste se realmente tá na tabela ;)
    console.log("Dados retornados:", employee)

    if (employee) {
        return res.status(200).json({ // Se for muito conteúdo dentro de {} é bom quebrar :)
            message: 'Login realizado com sucesso',
            user: { // Destruturação :)
                id: employee.id_users,
                name: employee.name,
                role: employee.role,
                active: employee.active
            },
            session: data.session
        })
    }

    return res.status(404).json({
    message: "Usuário autenticado, mas perfil não encontrado"
    })
}