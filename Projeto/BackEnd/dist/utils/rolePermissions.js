const permissions = {
    admin: [
        "admin",
        "owner",
        "attendant",
        "employee"
    ],
    owner: [
        "owner",
        "attendant",
        "employee"
    ],
    attendant: [
        "customer"
    ],
    employee: []
};
export function canCreateRole(creatorRole, roleToCreate) {
    console.log("Creator role:", creatorRole);
    console.log("Role to create:", roleToCreate);
    console.log("Permissions:", permissions[creatorRole]);
    return permissions[creatorRole].includes(roleToCreate);
}
