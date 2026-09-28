import { supabase } from "../supabase.js";
export async function loginMiddleware(req, res, next) {
    const loginHeader = req.headers.authorization;
    if (!loginHeader) {
        return res.status(401).json({ message: "Token não encontrado." });
    }
    const token = loginHeader.replace("Bearer", "");
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
        return res.status(401).json({ message: "Token inválido ou expirado..." });
    }
    req.user = data.user;
    next();
}
