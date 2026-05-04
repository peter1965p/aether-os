/**
 * AETHER OS - ROOT ROUTER
 * Pfad: src/app/page.tsx
 *
 * Diese Datei stellt sicher, dass beim Aufruf von "/"
 * direkt deine Homepage geladen wird.
 */

import Homepage from "./(frontend)/page";

export default function RootPage() {
    return <Homepage />;
}