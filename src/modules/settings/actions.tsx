'use server'

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { writeFile } from 'fs/promises';
import { join } from 'path';

// 1. Die fehlende Funktion exportieren!
export async function getSettings() {
  try {
    const rows = db.prepare('SELECT key, value FROM site_settings').all() as {key: string, value: string}[];
    return rows.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {} as Record<string, string>);
  } catch (error) {
    console.error("Datenbank-Fehler bei getSettings:", error);
    return {};
  }
}

// 2. Funktion für die About-Sektion (getrennt vom Hero!)
export async function updateAboutSection(formData: FormData) {
  try {
    const title = formData.get('about_title') as string;
    const content = formData.get('about_content') as string;
    const file = formData.get('image_file') as File;
    let image_url = formData.get('about_image_url') as string;

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const path = join(process.cwd(), 'public', 'uploads', file.name);
      await writeFile(path, buffer);
      image_url = `/uploads/${file.name}`;
    }

    db.prepare(`
      UPDATE page_sections 
      SET title = ?, content = ?, image_url = ? 
      WHERE section_type = 'about'
    `).run(title, content, image_url);

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("About Update Error:", error);
    return { success: false };
  }
}

// 3. Funktion für den Hero-Bereich (site_settings Tabelle)
export async function updateHeroSettings(formData: FormData) {
  try {
    const heroTitle = formData.get('hero_title') as string;
    const heroDesc = formData.get('hero_description') as string;

    const updateQuery = db.prepare('UPDATE site_settings SET value = ? WHERE key = ?');
    updateQuery.run(heroTitle, 'hero_title');
    updateQuery.run(heroDesc, 'hero_desc');

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Hero Update Error:", error);
    return { success: false };
  }
}

// 4. Funktion für die Konfiguration des Payment Gateway
export async function updateTerminalSettings(formData: FormData) {
  const provider = formData.get('provider') as string;
  const ip = formData.get('terminal_ip') as string;
  const tid = formData.get('terminal_id') as string;

  try {
    // Wir halten nur einen aktiven Config-Satz
    db.prepare("DELETE FROM pos_settings").run(); 
    db.prepare(`
      INSERT INTO pos_settings (provider, api_endpoint, terminal_id, active) 
      VALUES (?, ?, ?, 1)
    `).run(provider, ip, tid);

    revalidatePath('/admin/settings');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}