/**
 * AETHER OS // CORE ACTIONS // SETTINGS & INFRASTRUCTURE SYNC
 * Steuert Branding, Legal Identity und Multi-Gateway Infrastructure.
 */

"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getGlobalSettings() {
    try {
        const { data: settings, error: settingsError } = await db
            .from("settings")
            .select("*")
            .limit(1)
            .maybeSingle();

        const { data: intel } = await db
            .from("intelligence_hub")
            .select("*")
            .eq("id", "global_config")
            .maybeSingle();

        if (settingsError) throw settingsError;

        return { ...settings, intel: intel || null };
    } catch (err) {
        console.error("AETHER_OS // SETTINGS_FETCH_CRITICAL:", err);
        return null;
    }
}

export async function updateGlobalSettings(formData: FormData) {
    // Identität & Finanzen
    const company = formData.get("company_name") as string;
    const designation = formData.get("system_designation") as string;
    const vatStandard = formData.get("vat_standard") as string;
    const vatReduced = formData.get("vat_reduced") as string;
    const supportEmail = formData.get("support_email") as string;

    // Legal & Operator
    const ownerName = formData.get("owner_name") as string;
    const companyFullName = formData.get("company_full_name") as string;
    const addressFull = formData.get("address_full") as string;
    const taxNumber = formData.get("tax_number") as string;
    const vatId = formData.get("vat_id") as string;

    // Infrastructure (AWS & Resend)
    const awsAccessKey = formData.get("aws_access_key") as string;
    const awsSecretKey = formData.get("aws_secret_key") as string;
    const awsRegion = formData.get("aws_region") as string;
    const awsBucket = formData.get("aws_default_bucket") as string;
    const resendKey = formData.get("resend_api_key") as string;

    // Multi-Payment Gateway Logic (Stripe & Mollie)
    const stripePublic = formData.get("stripe_public_key") as string;
    const stripeSecret = formData.get("stripe_secret_key") as string;
    const mollieLive = formData.get("mollie_live_key") as string;
    const mollieTest = formData.get("mollie_test_key") as string;
    const activeGateway = formData.get("active_payment_gateway") as string; // 'stripe' | 'mollie'

    // Intelligence Hub
    const strategyMode = formData.get("strategy_mode") as string;
    const marketPulse = formData.get("market_pulse") as string;
    const aiContext = formData.get("ai_context_briefing") as string;

    try {
        const { data: current } = await db.from("settings").select("id").limit(1).maybeSingle();

        const settingsPayload = {
            company_name: company,
            system_designation: designation,
            vat_standard: vatStandard ? parseFloat(vatStandard) : 19.0,
            vat_reduced: vatReduced ? parseFloat(vatReduced) : 7.0,
            support_email: supportEmail,
            owner_name: ownerName,
            company_full_name: companyFullName,
            address_full: addressFull,
            tax_number: taxNumber,
            vat_id: vatId,
            aws_access_key: awsAccessKey,
            aws_secret_key: awsSecretKey,
            aws_region: awsRegion || "eu-central-1",
            aws_default_bucket: awsBucket,
            resend_api_key: resendKey,
            stripe_public_key: stripePublic,
            stripe_secret_key: stripeSecret,
            mollie_live_key: mollieLive,
            mollie_test_key: mollieTest,
            active_payment_gateway: activeGateway || 'stripe',
            updated_at: new Date().toISOString()
        };

        if (current?.id) {
            await db.from("settings").update(settingsPayload).eq("id", current.id);
        } else {
            await db.from("settings").insert([settingsPayload]);
        }

        await db.from("intelligence_hub").upsert({
            id: "global_config",
            strategy_mode: strategyMode,
            market_pulse: marketPulse ? parseInt(marketPulse) : 50,
            ai_context_briefing: aiContext,
            updated_at: new Date().toISOString()
        });

        revalidatePath("/", "layout");
        revalidatePath("/admin/settings");
        return { success: true, message: "AETHER_CORE_SYNC_COMPLETE" };
    } catch (err: any) {
        console.error("AETHER_OS // SYNC_FAULT:", err.message);
        return { success: false, message: "DATABASE_WRITE_ERROR" };
    }
}

export async function getDynamicConfig() {
    try {
        const { data: config } = await db.from("settings").select("*").maybeSingle();

        return {
            awsAccessKey: config?.aws_access_key || process.env.AWS_ACCESS_KEY_ID,
            awsSecretKey: config?.aws_secret_key || process.env.AWS_SECRET_ACCESS_KEY,
            awsRegion: config?.aws_region || 'eu-central-1',
            resendKey: config?.resend_api_key || process.env.RESEND_API_KEY,
            // Payment Gateway Switcher
            activeGateway: config?.active_payment_gateway || 'stripe',
            stripeKey: config?.stripe_public_key || process.env.STRIPE_PUBLIC_KEY,
            mollieKey: config?.mollie_live_key || process.env.MOLLIE_API_KEY
        };
    } catch (err) {
        return { resendKey: process.env.RESEND_API_KEY };
    }
}