import db from "@/lib/db";

export async function getSystemIdentity() {
    /**
     * Wir ziehen die Daten aus der Tabelle 'settings',
     * wie sie in deinem SQL-Schema definiert ist.
     */
    const { data, error } = await db
        .from("settings")
        .select(`
            owner_name,
            company_full_name,
            support_email,
            address_full,
            tax_number,
            vat_id,
            system_designation
        `)
        .single(); // Wir brauchen nur den einen globalen Datensatz

    if (error || !data) {
        console.error("AETHER // Identity Sync Error:", error);
        return null;
    }

    /**
     * MAPPING FÜR DEN COMPLIANCE GUARD (DAS BRAIN)
     * Die KI erwartet bestimmte Begriffe, um das Impressum zu prüfen.
     */
    return {
        owner: data.owner_name,
        company: data.company_full_name,
        email: data.support_email, // Wichtig für den Brain-Link!
        address: data.address_full,
        taxId: data.tax_number,
        vatId: data.vat_id,
        systemName: data.system_designation
    };
}