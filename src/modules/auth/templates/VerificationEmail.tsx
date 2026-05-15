/**
 * AETHER OS // EMAIL TEMPLATE // TS-SAFE VERSION
 * Path: /modules/auth/templates/VerificationEmail.tsx
 */

import * as React from 'react';

interface VerificationEmailProps {
    customerName: string;
    customerNumber: string | number;
    verificationCode: string | number;
    confirmLink: string;
}

// Wir nutzen React.ReactElement statt JSX.Element für maximale Kompatibilität
export const VerificationEmail = ({
    customerName,
    customerNumber,
    verificationCode,
    confirmLink,
}: VerificationEmailProps): React.ReactElement => {
    return (
        <div style={{
            backgroundColor: '#020406',
            color: '#e4e4e7',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            padding: '40px 20px',
            margin: '0',
        }}>
            <div style={{
                maxWidth: '600px',
                margin: '0 auto',
                backgroundColor: '#000000',
                border: '1px solid #ea580c',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 0 30px rgba(234, 88, 12, 0.15)'
            }}>
                {/* Header */}
                <div style={{ 
                    backgroundColor: '#0c0a09', 
                    padding: '30px', 
                    textAlign: 'center', 
                    borderBottom: '1px solid #ea580c' 
                }}>
                    <h1 style={{ 
                        margin: 0, 
                        color: '#ea580c', 
                        fontSize: '24px', 
                        letterSpacing: '5px', 
                        textTransform: 'uppercase',
                        fontStyle: 'italic',
                        fontWeight: '900'
                    }}>
                        AETHER OS
                    </h1>
                </div>

                <div style={{ padding: '40px' }}>
                    <div style={{ 
                        fontSize: '14px', 
                        textTransform: 'uppercase', 
                        letterSpacing: '2px', 
                        color: '#ea580c',
                        marginBottom: '20px'
                    }}>
                        IDENTITÄT ERKANNT: <span style={{ color: '#fff' }}>{customerName}</span>
                    </div>

                    <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#a1a1aa' }}>
                        Initialisierung im <strong>AETHER Netzwerk</strong> erfolgreich.
                        Aktivieren Sie Ihren Node über den folgenden Code:
                    </p>

                    <div style={{
                        backgroundColor: '#1c1917',
                        border: '1px dashed #ea580c',
                        padding: '30px',
                        textAlign: 'center',
                        margin: '30px 0',
                        borderRadius: '8px'
                    }}>
                        <span style={{ 
                            display: 'block', 
                            fontSize: '10px', 
                            color: '#71717a', 
                            letterSpacing: '3px',
                            marginBottom: '10px'
                        }}>
                            INITIAL_UPLINK_CODE
                        </span>
                        <span style={{ 
                            fontSize: '36px', 
                            fontWeight: 'bold', 
                            color: '#ea580c', 
                            letterSpacing: '10px' 
                        }}>
                            {verificationCode}
                        </span>
                    </div>

                    <div style={{ textAlign: 'center', margin: '30px 0' }}>
                        <a href={confirmLink} style={{
                            backgroundColor: '#ea580c',
                            color: '#ffffff',
                            padding: '18px 36px',
                            textDecoration: 'none',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            display: 'inline-block',
                            fontSize: '13px',
                            letterSpacing: '2px',
                            textTransform: 'uppercase'
                        }}>
                            Uplink bestätigen
                        </a>
                    </div>

                    <p style={{ fontSize: '12px', color: '#52525b', textAlign: 'center' }}>
                        ID-NODE: <span style={{ color: '#ea580c' }}>#{customerNumber}</span>
                    </p>
                </div>

                <div style={{ 
                    padding: '20px', 
                    backgroundColor: '#0c0a09', 
                    borderTop: '1px solid #27272a',
                    textAlign: 'center',
                    fontSize: '10px',
                    color: '#3f3f46'
                }}>
                    <p style={{ margin: '5px 0' }}>SYSTEM_CORE // SECURITY_PROTOCOL_AES256</p>
                </div>
            </div>
        </div>
    );
};

export default VerificationEmail;