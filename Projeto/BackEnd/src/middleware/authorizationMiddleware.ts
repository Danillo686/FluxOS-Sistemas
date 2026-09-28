import { Request, Response, NextFunction } from "express"
import { EmployeeRole } from "../types/User.js"

const permissions: Record<EmployeeRole, EmployeeRole[]> = {
    admin: ['owner', 'attendant', 'employee'], //Significa "Admin pode criar Owner, Attendant e Employee", etc
    owner: ['manager', 'attendant', 'employee'],
    manager: ['attendant', 'employee'],
    attendant: [],
    employee: []
}

export function CanCreateRole (
    creatorRole: EmployeeRole,
    roleToCreate: EmployeeRole
): boolean {
    return permissions[creatorRole]?.includes(roleToCreate) ?? false
}

export type Permissions = 
    | 'create_employee'
    | 'create_customer'

const actionPermissions: Record<EmployeeRole, Permissions[]> = {
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
}

export function CanPerformAction (
    creatorRole: EmployeeRole,
    action: Permissions
): boolean {
    return actionPermissions[creatorRole]?.includes(action) ?? false
}

//Autorização do Users
export const authorizationMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    const creatorRole = req.employee?.role as EmployeeRole
    const roleToCreate = req.body.role as EmployeeRole // Ele já pega manualmente, sem precisar usar manualmente

    if (!creatorRole) {
        res.status(403).json({message: 'Usuário não possui uma função válida'}) 
        return
    }

    const allowed = CanCreateRole (
        creatorRole, 
        roleToCreate
    )

    if (!allowed) {
        res.status(401).json({message: `${creatorRole} não pode criar ${roleToCreate}`})
        return
    }

    next()
}

export const actionAuthorizationMiddleware = (
    action: Permissions
) => {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ): void => {
        const creatorRole = req.employee?.role as EmployeeRole

        if (!creatorRole) {
            res.status(403).json({message: 'Usuário não possui uma função válida'})
            return
        }

        const allowed = CanPerformAction (
            creatorRole,
            action
        )

        if (!allowed) {
            res.status(403).json({message: `${creatorRole} não possui permissão para ${action}`})
            return
        }

        next()
    }
}
