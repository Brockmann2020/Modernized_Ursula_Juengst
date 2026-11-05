'use client';

import { styled } from '@mui/material/styles';

import { displayFont, galleryColors, siteWidth } from './SiteTheme';

export const Header = styled('header')(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  '--header-accent': theme.palette.primary.main,
  '--header-rule': theme.palette.divider,
  '&[data-tone="contrast"]': {
    color: galleryColors.ink,
    backgroundColor: galleryColors.canvas,
    borderColor: galleryColors.rule,
    '--header-accent': galleryColors.accent,
    '--header-rule': galleryColors.rule,
  },
  backgroundColor: theme.palette.background.default,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const HeaderBar = styled('div')(({ theme }) => ({
  maxWidth: siteWidth,
  minHeight: 76,
  marginInline: 'auto',
  paddingInline: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    minHeight: 88,
    paddingInline: theme.spacing(6),
    gap: theme.spacing(4),
  },
}));

export const Wordmark = styled('a')(({ theme }) => ({
  marginRight: 'auto',
  color: 'inherit',
  fontFamily: displayFont,
  fontSize: 'clamp(1.45rem, 3vw, 2.2rem)',
  letterSpacing: '-0.055em',
  lineHeight: 1,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  '&:hover': { color: 'var(--header-accent)' },
}));

export const LanguageLink = styled('a')(({ theme }) => ({
  color: 'inherit',
  display: 'grid',
  placeItems: 'center',
  width: 44,
  height: 44,
  border: '1px solid var(--header-rule)',
  borderRadius: '50%',
  fontSize: '0.72rem',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textDecoration: 'none',
  '&:hover': { borderColor: 'var(--header-accent)', color: 'var(--header-accent)' },
}));

export const Footer = styled('footer')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(1.5, 3),
  padding: theme.spacing(4, 3),
  borderTop: `1px solid ${theme.palette.divider}`,
  textAlign: 'center',
  fontSize: '0.85rem',
  '& a': { color: theme.palette.text.secondary, textUnderlineOffset: '0.2em' },
}));
