/**
 * AETHER OS // EMAIL TEMPLATE
 * Zweck: Professionelle Bestätigungs-Mail inkl. Kundennummer
 */

import * as React from 'react';

interface VerificationEmailProps {
    customerName: string;
    customerNumber: number;
    confirmLink: string;
}

export const VerificationEmail: React.FC<Readonly<VerificationEmailProps>> = ({
                                                                                  customerName,
                                                                                  customerNumber,
                                                                                  confirmLink,
                                                                              }) => (
    <div style={{
        fontFamily: 'sans-serif',
        color: '#333',
        maxWidth: '600px',
        margin: '0 auto',
        border: '1px solid #eee',
        padding: '20px'
    }}>
        {/* Header mit Branding */}
        <div style={{ borderBottom: '2px solid #0055ff', paddingBottom: '20px', marginBottom: '20px' }}>
            <h1 style={{ margin: 0, fontSize: '20px', color: '#0055ff' }}>AETHER OS</h1>
        </div>

        <p>Sehr geehrte(r) <strong>{customerName}</strong>,</p>

        <p>vielen Dank für Ihre Anmeldung bei <strong>AETHER OS</strong>.</p>

        <p>Bitte klicken Sie auf den folgenden Link, um Ihre E-Mail-Adresse zu bestätigen und Ihr Profil zu aktivieren:</p>

        {/* Der Button */}
        <div style={{ textAlign: 'center', margin: '30px 0' }}>
            <a href={confirmLink} style={{
                backgroundColor: '#0055ff',
                color: '#ffffff',
                padding: '15px 30px',
                textDecoration: 'none',
                borderRadius: '5px',
                fontWeight: 'bold',
                display: 'inline-block'
            }}>
                E-Mail-Adresse bestätigen
            </a>
        </div>

        <p style={{ fontSize: '14px', color: '#666' }}>
            Für Rückfragen steht Ihnen unser Support-Team gerne zur Verfügung.
            Bitte halten Sie Ihre <strong>Kundennummer {customerNumber}</strong> bereit, wenn Sie sich an uns wenden.
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '20px 0' }} />

        <table style={{ width: '100%', fontSize: '12px', color: '#999' }}>
            <tr>
                <td>
                    <strong>Ihre Kundennummer</strong><br />
                    {customerNumber}
                </td>
                <td style={{ textAlign: 'right' }}>
                    <strong>Support</strong><br />
                    news24regional@gmail.com
                </td>
            </tr>
        </table>
    </div>
);