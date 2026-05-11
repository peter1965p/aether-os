"use server";
import db from "@/lib/db";

export async function createNotification(source: 'ADMIN' | 'CLIENT' | 'PROFILE', type: string, msg: string) {
    try {
        const { error } = await db
            .from('notifications')
            .insert([{ source, type, msg }]);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error("Sentinel Error:", error);
        return { success: false };
    }
}