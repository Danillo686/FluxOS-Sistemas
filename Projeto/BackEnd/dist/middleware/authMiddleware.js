import { supabase } from "../supabase.js";
export const authMiddleware = async (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).json({ message: 'Token não informado' });
    }
    const token = authorization.replace('Bearer', '');
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
        return res.status(401).json({ message: 'Token inválido ou expirado' });
    }
    const userId = data.user.id;
    const { data: employee, error: employeeError } = await supabase
        .from('users')
        .select('id_users, name, role, active')
        .eq('id_users', userId)
        .maybeSingle();
    if (employeeError) {
        return res.status(500).json({ message: 'Erro ao buscar usuário', error: employeeError.message });
    }
    if (!employee) {
        return res.status(403).json({ message: 'Usuário não é funcionário da empresa' });
    }
    if (!employee.active) {
        return res.status(403).json({ message: 'Usuário está inativo' });
    }
    req.user = data.user;
    req.employee = {
        id: employee.id_users,
        name: employee.name,
        role: employee.role,
        active: employee.active
    };
    next();
};
