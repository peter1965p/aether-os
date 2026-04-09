// src/components/layout/shared/theme/index.ts
import standard from './standard.json';
import industrialLight from './industrial-light.json'; // Ein fiktives zweites Theme

export const themes = {
  "aether-dark-industrial": standard,
  "aether-light": industrialLight,
};

export type ThemeKey = keyof typeof themes;
