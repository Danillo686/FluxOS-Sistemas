const permissions = {
    admin: ['owner', 'attendant', 'employee'], //Significa "Admin pode criar Owner, Attendant e Employee", etc
    owner: ['manager', 'attendant', 'employee'],
    manager: ['attendant', 'employee'],
    attendant: [],
    employee: []
};
export function CanCreateRole(creatorRole, roleToCreate) {
    return permissions[creatorRole]?.includes(roleToCreate) ?? false;
}
const actionPermissions = {
    admin: [
        "create_employee",
        "create_service"
    ],
    owner: [
        "create_employee",
        "create_service"
    ],
    manager: [
        "create_employee",
        "create_service",
        "assign_service"
    ],
    attendant: [
        "create_customer",
        "create_vehicle",
        "create_service_order",
        "create_service", //--> NÂO È CONFIRMADO, TIRAR DPS
        "add_service_to_order",
        "update_service_progress"
    ],
    employee: []
};
export function CanPerformAction(creatorRole, action) {
    return actionPermissions[creatorRole]?.includes(action) ?? false;
}
//Autorização do Users
export const authorizationMiddleware = (req, res, next) => {
    const creatorRole = req.employee?.role;
    const roleToCreate = req.body.role; // Ele já pega manualmente, sem precisar usar manualmente
    if (!creatorRole) {
        res.status(403).json({ message: 'Usuário não possui uma função válida' });
        return;
    }
    const allowed = CanCreateRole(creatorRole, roleToCreate);
    if (!allowed) {
        // A conta está autenticada, mas não tem permissão para criar essa função.
        res.status(403).json({ message: `${creatorRole} não pode criar ${roleToCreate}` });
        return;
    }
    next();
};
export const actionAuthorizationMiddleware = (action) => {
    return (req, res, next) => {
        const creatorRole = req.employee?.role;
        if (!creatorRole) {
            res.status(403).json({ message: 'Usuário não possui uma função válida' });
            return;
        }
        const allowed = CanPerformAction(creatorRole, action);
        if (!allowed) {
            res.status(403).json({ message: `${creatorRole} não possui permissão para ${action}` });
            return;
        }
        next();
    };
};
