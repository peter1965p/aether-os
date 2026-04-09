// src/lib/resend.ts
import { Resend } from 'resend';

// Initialisierung mit dem Key aus der .env
export const resend = new Resend(process.env.RESEND_API_KEY);