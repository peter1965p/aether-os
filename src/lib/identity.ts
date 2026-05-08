import db from "@/lib/db";

export async function getSystemIdentity() {
    const { data, error } = await db
        .from("system_identity")
        .select("key, value");

    if (error) return {};

    // Wandelt das Array in ein flaches Objekt um: { company_name: "News24Regional", ... }
    return data.reduce((acc: any, curr: { key: string | number; value: any; }) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {});
}