    import { Request, Response } from "express"
    import { supabase, supabaseAdmin } from "../supabase.js"

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
            // Diagnóstico do Auth sem registrar email, senha ou token.
            console.error('Falha de autenticação Supabase:', {
                message: error.message,
                status: error.status,
                code: error.code
            })
            return res.status(401).json({message: "Email ou senha inválidos"})
        }

        const userId = data.user.id
        let profileUser: any = null

        const {data: employee, error: employeeError} = await supabaseAdmin
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
            profileUser = {
                id: employee.id_users,
                name: employee.name,
                role: employee.role, 
                active: employee.active
            }
        }else{
            const {data: customer, error: customerError} = await supabaseAdmin
            .from('customer')
            .select('id_customer, name, role, zip_code')
            .eq('id_customer', userId)
            .maybeSingle()
            if (customerError) {
                return res.status(500).json({message: 'Erro ao procurar cliente', error: customerError.message})
            }

            if(customer) {
                    profileUser = {
                    id: customer.id_customer,
                    name: customer.name,
                    role: 'customer', // Forçamos a role como 'customer' para o switch do front-end funcionar
                    zip_code: customer.zip_code     
                    
                }
            }
        } 
        
        console.log("=== TESTE DE LOGIN ===")
        console.log("Perfil identificado:", profileUser)

        if (profileUser) {
        return res.status(200).json({
            message: 'Login realizado com sucesso',
            user: profileUser,
            session: data.session
            })
        }

        // Login válido sem perfil correspondente ao UID do Auth.
        return res.status(404).json({
        message: "Conta autenticada, mas sem perfil vinculado. O ID do usuário no Supabase Auth deve corresponder a users.id_users ou customer.id_customer."
        })
    }