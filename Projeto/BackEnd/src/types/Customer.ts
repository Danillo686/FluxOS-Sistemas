export interface Customer {
    id_customer: string
    name: string
    cpf: string
    zip_code: string
    photo?: string
    phone: string
    role: "customer"
}