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
        "create_employee"
    ],
    owner: [
        "create_employee"
    ],
    manager: [
        "create_employee"
    ],
    attendant: [
        "create_customer"
    ],
    employee: [
        "create_employee"
    ]
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
        res.status(401).json({ message: `${creatorRole} não pode criar ${roleToCreate}` });
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
