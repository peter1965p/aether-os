'use server'

import db from '@/lib/db';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

/**
 * HILFSFUNKTION: DATEI-UPLOAD
 */
async function handleFileUpload(file: File | null) {
  if (!file || file.size === 0) return null;
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    const uploadPath = path.join(uploadDir, fileName);
    await mkdir(uploadDir, { recursive: true });
    await writeFile(uploadPath, buffer);
    return `/uploads/${fileName}`;
  } catch (error) {
    console.error("Upload Error:", error);
    return null;
  }
}

/**
 * POST ERSTELLEN
 */
export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const excerpt = formData.get('excerpt') as string;
  const content = formData.get('content') as string;
  const imageFile = formData.get('image') as File | null;

  const slug = title.toLowerCase().trim()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

  const main_image = await handleFileUpload(imageFile);

  const { error } = await db
    .from('blog_posts')
    .insert([{
      title,
      slug,
      content,
      excerpt,
      main_image,
      author_id: 1, // Standard Admin ID
    }]);

  if (error) console.error("Create Error:", error.message);

  revalidatePath('/blog');
  revalidatePath('/admin/blog');
  redirect('/admin/blog');
}

/**
 * POST AKTUALISIEREN
 */
export async function updatePost(id: number, formData: FormData) {
  const title = formData.get('title') as string;
  const excerpt = formData.get('excerpt') as string;
  const content = formData.get('content') as string;
  const imageFile = formData.get('image') as File | null;

  let main_image = formData.get('existing_image') as string;
  const newImage = await handleFileUpload(imageFile);
  if (newImage) main_image = newImage;

  const { error } = await db
    .from('blog_posts')
    .update({ title, content, excerpt, main_image })
    .eq('id', id);

  if (error) console.error("Update Error:", error.message);

  revalidatePath('/blog');
  revalidatePath('/admin/blog');
  redirect('/admin/blog');
}

/**
 * POST LÖSCHEN (DB-only Fix)
 */
export async function deletePost(id: number) {
  const { error } = await db
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) console.error("Delete Error:", error.message);
  revalidatePath('/blog');
  revalidatePath('/admin/blog');
}

/**
 * GETTER: ALLE POSTS
 */
export async function getBlogPosts() {
  const { data, error } = await db
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Fetch Error:", error.message);
    return { success: false, data: [] };
  }
  return { success: true, data: data || [] };
}

/**
 * GETTER: EINZELNER POST (BY SLUG)
 */
export async function getBlogPostBySlug(slug: string) {
  const { data, error } = await db
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error("Fetch Single Error:", error.message);
    return { success: false, data: null };
  }
  return { success: true, data };
}