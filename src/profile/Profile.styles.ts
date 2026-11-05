'use client';

import { styled } from '@mui/material/styles';

import { displayFont, siteWidth } from '../site/SiteTheme';

export const ProfileIntro = styled('div')(({ theme }) => ({
  display: 'grid',
  alignItems: 'center',
  gap: theme.spacing(4),
  maxWidth: siteWidth,
  marginInline: 'auto',
  padding: theme.spacing(5, 3),
  '&[data-profile="biography"]': {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  '&[data-profile="contact"]': {
    alignItems: 'start',
  },
  '& h1': {
    margin: theme.spacing(1, 0, 2),
    fontFamily: displayFont,
    fontSize: 'clamp(3rem, 7vw, 7rem)',
    fontWeight: 400,
    letterSpacing: '-0.06em',
    lineHeight: 0.98,
    textWrap: 'balance',
  },
  '& [data-eyebrow]': {
    color: theme.palette.primary.main,
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    fontWeight: 700,
    fontSize: '0.75rem',
  },
  '& p': { margin: 0, maxWidth: '31ch', color: theme.palette.text.secondary, fontSize: '1.15rem' },
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'minmax(0, 0.85fr) minmax(0, 1.15fr)',
    padding: theme.spacing(7, 6),
    gap: theme.spacing(6),
  },
}));

export const ProfileImage = styled('img')({
  display: 'block',
  width: '100%',
  height: 'auto',
});

export const Timeline = styled('section')(({ theme }) => ({
  maxWidth: siteWidth,
  marginInline: 'auto',
  padding: theme.spacing(5, 3, 8),
  borderTop: `1px solid ${theme.palette.divider}`,
  '& h2': {
    margin: theme.spacing(0, 0, 3),
    fontFamily: displayFont,
    fontWeight: 400,
    fontSize: 'clamp(2rem, 4vw, 3.5rem)',
  },
  '& ol': { padding: 0, margin: 0, listStyle: 'none', maxWidth: 980 },
  '& li': {
    display: 'grid',
    gridTemplateColumns: 'minmax(5.75rem, 1fr) minmax(0, 4fr)',
    gap: theme.spacing(2),
    padding: theme.spacing(2.25, 0),
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  '& li span:first-of-type': { color: theme.palette.primary.main, fontWeight: 700 },
  [theme.breakpoints.up('md')]: { paddingInline: theme.spacing(6) },
}));

export const ContactDetails = styled('address')(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2),
  fontStyle: 'normal',
  minWidth: 0,
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  '& > div + div': { paddingTop: theme.spacing(2), borderTop: `1px solid ${theme.palette.divider}` },
  '& strong': { display: 'block', marginBottom: theme.spacing(0.5) },
  '& ul': { listStyle: 'none', margin: 0, padding: 0 },
  '& a': {
    color: theme.palette.primary.main,
    textUnderlineOffset: '0.2em',
    overflowWrap: 'anywhere',
  },
}));

export const ContactAction = styled('a')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2.5),
  padding: theme.spacing(1.25, 2.25),
  backgroundColor: theme.palette.text.primary,
  color: theme.palette.background.paper,
  borderRadius: 99,
  textDecoration: 'none',
  '&:hover': { backgroundColor: theme.palette.primary.main },
}));

export const ContactImage = styled('div')(({ theme }) => ({
  maxWidth: siteWidth,
  marginInline: 'auto',
  padding: theme.spacing(0, 3, 6),
  [theme.breakpoints.up('md')]: { paddingInline: theme.spacing(6) },
}));
