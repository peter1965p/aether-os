// /types/ticket.ts

export interface AetherTicket {
    id: number;
    created_at: string;
    subject: string;
    message: string;
    status: 'open' | 'analyzing' | 'resolved' | 'dispatched' | 'COMMAND_DISPATCHED';
    asset_node_id: string | null;
    telemetry_data: {
        cpu_load?: string;
        last_reboot?: string;
        system_kernel?: string;
    } | null;
    automated_action_log: {
        timestamp: string;
        action: string;
        result: string;
    } | null;
    external_sync_status?: string;

    scheduled_date: string | null; // Zeitstempel setzen
}