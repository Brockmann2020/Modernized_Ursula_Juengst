'use client';

import { styled } from '@mui/material/styles';

import { siteWidth } from './SiteTheme';

export const Navigation = styled('nav')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(4),
  '& a': { color: 'inherit', textDecoration: 'none' },
  '& a:hover, & a[aria-current]': { color: 'var(--header-accent)' },
}));

export const QuickLinks = styled('div')(({ theme }) => ({
  display: 'none',
  fontSize: '0.9rem',
  fontWeight: 600,
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(3.5),
  },
}));

export const Menu = styled('details')(({ theme }) => ({
  '& summary': {
    minHeight: 44,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.25),
    cursor: 'pointer',
    listStyle: 'none',
    fontSize: '0.9rem',
    fontWeight: 600,
  },
  '& summary::-webkit-details-marker': { display: 'none' },
  '& summary:hover, &[open] summary': { color: 'var(--header-accent)' },
  '& .menu-icon': {
    width: 16,
    height: 8,
    borderBlock: '1px solid currentColor',
  },
}));

export const MenuPanel = styled('div')(({ theme }) => ({
  position: 'absolute',
  inset: '100% 0 auto',
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: theme.spacing(3),
  maxHeight: 'calc(100dvh - 88px)',
  maxWidth: siteWidth,
  marginInline: 'auto',
  padding: theme.spacing(3),
  overflowY: 'auto',
  color: theme.palette.text.primary,
  '--header-accent': theme.palette.primary.main,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: '0 16px 32px rgb(24 21 18 / 12%)',
  '& p': {
    margin: 0,
    color: theme.palette.primary.main,
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  '& ul': { listStyle: 'none', margin: theme.spacing(1, 0, 0), padding: 0 },
  '& a': { display: 'block', paddingBlock: theme.spacing(0.75), fontSize: '0.875rem' },
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    padding: theme.spacing(4, 6),
  },
}));
