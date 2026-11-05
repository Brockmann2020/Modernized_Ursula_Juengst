'use client';

import type { ReactNode } from 'react';
import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export const surfaces = { light: '#f4f4f4', dark: '#eaeaea' };
export const galleryWidth = 1440;

const theme = createTheme({
  breakpoints: { values: { xs: 0, sm: 600, md: 900, lg: 1240, xl: 1536 } },
  palette: {
    primary: { main: '#a43a00' },
    text: { primary: '#333', secondary: '#565656' },
    background: { default: '#fff' },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    h1: { fontWeight: 400, fontSize: 'clamp(2rem, 5vw, 3rem)' },
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
