//Basicamente os campos :)
export interface ServiceOrder {
    id_service_orders: number
    vehicle_id: number
    attendant_id: string
    employee_id: string | null
    status: string
    customer_report: string
    notes: string | null
    entry_date: string
    estimated_completion_date: string | null
    total_value: number | null
}