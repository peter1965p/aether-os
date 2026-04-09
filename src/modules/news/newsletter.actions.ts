"use server";

import db from "@/lib/db";

export async function subscribeToNewsletter(formData: FormData) {
    const email = formData.get("email") as string;

    if (!email || !email.includes("@")) {
    return { error: "Ungültige E-Mail Adresse" };
}

try {
    const { error } = await db
      .from("newsletter_subs")
      .insert([{ email }]);

    if (error) {
      if (error.code === "23505") return { error: "Bereits registriert!" };
      throw error;
}

return { success: true };
  } catch (err) {
    console.error("Newsletter Error:", err);
    return { error: "Systemfehler. Bitte später versuchen." };
  }
}