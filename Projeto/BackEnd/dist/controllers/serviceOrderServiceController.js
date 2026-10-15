import { supabaseAdmin } from "../supabase.js";
export const addServiceToOrder = async (req, res) => {
    const { service_order_id, service_id } = req.body;
    const orderId = Number(service_order_id);
    const serviceId = Number(service_id);
    if (!Number.isSafeInteger(orderId) || orderId <= 0 || !Number.isSafeInteger(serviceId) || serviceId <= 0) {
        return res.status(400).json({ message: 'Informe IDs válidos para a ordem e o serviço' });
    }
    const { data: order, error: orderError } = await supabaseAdmin
        .from('service_orders')
        .select('id_service_orders, status')
        .eq('id_service_orders', orderId)
        .maybeSingle();
    if (orderError) {
        return res.status(500).json({ message: 'Erro ao consultar ordem', error: orderError.message });
    }
    if (!order) {
        return res.status(404).json({ message: 'Ordem de serviço não encontrada' });
    }
    if (['completed', 'cancelled'].includes(order.status)) {
        return res.status(409).json({ message: 'Não é possível adicionar serviços a esta ordem' });
    }
    const { data: service, error: serviceError } = await supabaseAdmin
        .from('services')
        .select('id_service, price, active')
        .eq('id_service', serviceId)
        .maybeSingle();
    if (serviceError) {
        return res.status(500).json({ message: 'Erro ao consultar serviço', error: serviceError.message });
    }
    if (!service || !service.active) {
        return res.status(404).json({ message: 'Serviço não encontrado ou inativo' });
    }
    const { data: steps, error: stepsError } = await supabaseAdmin
        .from("service_steps")
        .select("id_step, step_order, description")
        .eq("service_id", serviceId)
        .order("step_order", { ascending: true });
    if (stepsError) {
        return res.status(500).json({ message: 'Erro ao buscar etapas do serviço', error: stepsError.message });
    }
    const { data: orderService, error: insertError } = await supabaseAdmin
        .from("service_order_services")
        .insert({
        service_order_id: orderId,
        service_id: serviceId,
        unit_value: service.price,
        status: "pending",
        added_by_technician: false
    })
        .select()
        .single();
    if (insertError) {
        return res.status(500).json({ message: 'Erro ao adicionar serviço à ordem', error: insertError.message });
    }
    if (steps && steps.length > 0) {
        const executions = steps.map((step) => ({
            order_service_id: orderService.id_order_service,
            step_id: step.id_step,
            completed: false
        }));
        const { data: createdExecutions, error: executionsError } = await supabaseAdmin
            .from("service_step_execution")
            .insert(executions)
            .select();
        if (executionsError) {
            const { error: rollbackError } = await supabaseAdmin
                .from("service_order_services")
                .delete()
                .eq("id_order_service", orderService.id_order_service);
            return res.status(500).json({ message: 'Falha ao criar as etapas de execução', error: executionsError, rollbackError: rollbackError?.message ?? null });
        }
        return res.status(201).json({ message: 'Serviço adicionado com suas etapas de execução!', data: { service: orderService, executions: createdExecutions } });
    }
    return res.status(201).json({ message: 'Serviço adicionado, mas não possui etapas cadastradas', data: { service: orderService, executions: [] } });
};
// Lista os serviços associados a uma ordem.
export const getOrderServices = async (req, res) => {
    const orderId = Number(req.params.orderId);
    if (!Number.isSafeInteger(orderId) || orderId <= 0) {
        return res.status(400).json({ message: 'ID da ordem inválido' });
    }
    const { data: orderServices, error } = await supabaseAdmin
        .from("service_order_services")
        .select("*")
        .eq("service_order_id", orderId);
    if (error) {
        return res.status(500).json({ message: "Erro ao buscar serviços da ordem", error: error.message });
    }
    return res.status(200).json({
        message: "Serviços da ordem encontrados",
        data: orderServices
    });
};
export const assignServiceToEmployee = async (req, res) => {
    const { orderServiceID, employeeID } = req.body;
    if (!Number.isSafeInteger(Number(orderServiceID)) || Number(orderServiceID) <= 0 || typeof employeeID !== "string" || !employeeID.trim()) {
        return res.status(400).json({ message: 'Informe IDs válidos para o serviço e o funcionário' });
    }
    const { data: orderService, error: orderServiceError } = await supabaseAdmin
        .from("service_order_services")
        .select("id_order_service, status")
        .eq("id_order_service", Number(orderServiceID))
        .maybeSingle();
    if (orderServiceError) {
        return res.status(500).json({ message: 'Erro ao consultar serviço da ordem', error: orderServiceError.message });
    }
    if (!orderService) {
        return res.status(404).json({ message: 'Serviço da ordem não encontrado' });
    }
    if (["completed", "cancelled"].includes(orderService.status)) {
        return res.status(409).json({ message: 'Não é possível atribuir um serviço finalizado ou cancelado' });
    }
    const { data: employee, error: employeeError } = await supabaseAdmin
        .from("users")
        .select("id_users, role, active")
        .eq("id_users", employeeID)
        .maybeSingle();
    if (employeeError) {
        return res.status(500).json({ message: "Erro ao consultar funcionário", error: employeeError.message });
    }
    if (!employee || !employee.active || employee.role !== "employee") {
        return res.status(400).json({ message: "Funcionário não encontrado, inativo ou sem a função employee" });
    }
    const { data: updatedService, error: updateError } = await supabaseAdmin
        .from("service_order_services")
        .update({
        technician_id: employee.id_users
    })
        .eq("id_order_service", Number(orderServiceID))
        .select()
        .single();
    if (updateError) {
        return res.status(500).json({ message: 'Erro ao atribuir serviço', error: updateError.message });
    }
    return res.status(200).json({
        message: "Serviço atribuído ao funcionário com sucesso!", data: updatedService
    });
};
export const updateOrderServiceStatus = async (req, res) => {
    const orderServiceId = Number(req.params.orderServiceId);
    const { status } = req.body;
    const allowedStatuses = ['in_progress', 'completed'];
    if (!Number.isSafeInteger(orderServiceId) || orderServiceId <= 0 || !allowedStatuses.includes(status)) {
        return res.status(400).json({ message: 'Informe um ID válido e um status permitido' });
    }
    const employeeId = req.employee?.id;
    if (!employeeId || req.employee?.role !== 'employee') {
        return res.status(403).json({ message: 'Somente funcionários podem atualizar o status' });
    }
    const { data: orderService, error } = await supabaseAdmin
        .from('service_order_services')
        .select('id_order_service, technician_id, status')
        .eq('id_order_service', orderServiceId)
        .maybeSingle();
    if (error) {
        return res.status(500).json({ message: 'Erro ao consultar serviço', error: error.message });
    }
    if (!orderService) {
        return res.status(404).json({ message: 'Serviço não encontrado' });
    }
    if (orderService.technician_id !== employeeId) {
        return res.status(403).json({ message: 'Este serviço não está atribuído a você' });
    }
    if (['completed', 'cancelled'].includes(orderService.status)) {
        return res.status(409).json({ message: 'O serviço já foi finalizado ou cancelado' });
    }
    if (orderService.status === 'pending' && status !== 'in_progress') {
        return res.status(409).json({ message: 'Inicie o serviço antes de concluí-lo' });
    }
    const { data: updatedService, error: updateError } = await supabaseAdmin
        .from('service_order_services')
        .update({ status })
        .eq('id_order_service', orderServiceId)
        .select()
        .single();
    if (updateError) {
        return res.status(500).json({ message: 'Erro ao atualizar status', error: updateError.message });
    }
    return res.status(200).json({ message: 'Status do serviço atualizado com sucesso!', data: updatedService });
};
