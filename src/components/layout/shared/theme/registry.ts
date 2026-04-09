import Navbar from "@/components/Navbar";
import AetherHero from "@/components/EnterpriseHero";
import { StatCard } from "@/components/layout/backend/card/StatCard";
import Footer from "@/components/layout/frontend/footer/Footer";

export const THEME_COMPONENTS: Record<string, React.ComponentType<any>> = {
  "Navigation": Navbar,      // Standard Header
  "Hero": AetherHero,        // Dein geiler Gradient-Hero
  "FeatureCard": StatCard,   // Die Karten für den Content
  "Footer": Footer           // Abschluss der Seite
};
