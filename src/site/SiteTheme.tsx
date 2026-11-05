'use client';

import type { ReactNode } from 'react';
import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export const surfaces = { light: '#f4f4f4', dark: '#eaeaea' };
export const galleryWidth = 1440;
export const siteWidth = 1536;
export const galleryColors = {
  canvas: '#26211f',
  ink: '#fff7ed',
  muted: '#dfcfc2',
  accent: '#f6ad85',
  rule: '#64524a',
};
export const displayFont = 'Georgia, Times New Roman, serif';

const theme = createTheme({
  breakpoints: { values: { xs: 0, sm: 600, md: 900, lg: 1240, xl: 1536 } },
  palette: {
    primary: { main: '#a43a00' },
    text: { primary: '#211d19', secondary: '#5f564d' },
    background: { default: '#f8f5ef', paper: '#fffdf8' },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    h1: { fontFamily: displayFont, fontWeight: 400, fontSize: 'clamp(2rem, 5vw, 3rem)' },
  },
});

export default function SiteTheme({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
