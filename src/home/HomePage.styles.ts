'use client';

import { styled } from '@mui/material/styles';

import { displayFont, siteWidth } from '../site/SiteTheme';

export const Hero = styled('section')(({ theme }) => ({
  maxWidth: siteWidth,
  marginInline: 'auto',
  padding: theme.spacing(5, 3, 6),
  display: 'grid',
  gap: theme.spacing(4),
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'minmax(0, 0.88fr) minmax(0, 1.12fr)',
    alignItems: 'center',
    gap: theme.spacing(5),
    padding: theme.spacing(6, 6, 8),
  },
}));

export const HeroCopy = styled('div')(({ theme }) => ({
  '& h1': {
    fontFamily: displayFont,
    fontSize: 'clamp(3.3rem, 6.2vw, 6.9rem)',
    fontWeight: 400,
    lineHeight: 0.98,
    letterSpacing: '-0.075em',
    margin: theme.spacing(2.5, 0, 3),
  },
  '& h1 span': { display: 'block' },
  '& h1 span:last-child': { fontStyle: 'italic', color: theme.palette.primary.main },
  '& p': {
    maxWidth: '29ch',
    color: theme.palette.text.secondary,
    fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
    lineHeight: 1.55,
    margin: theme.spacing(0, 0, 3),
  },
}));

export const Eyebrow = styled('div')(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  '& span': { marginInline: theme.spacing(0.65) },
}));

export const PrimaryLink = styled('a')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(2.5),
  padding: theme.spacing(1.4, 2.5),
  borderRadius: 100,
  color: theme.palette.background.paper,
  backgroundColor: theme.palette.text.primary,
  textDecoration: 'none',
  fontWeight: 600,
  '&:hover': { backgroundColor: theme.palette.primary.main },
}));

export const HeroWork = styled('figure')(({ theme }) => ({
  margin: 0,
  '& figcaption': {
    marginTop: theme.spacing(1.25),
    color: theme.palette.text.secondary,
    fontSize: '0.8rem',
    textAlign: 'right',
  },
}));

export const HeroImage = styled('img')({
  display: 'block',
  width: '100%',
  height: 'auto',
  aspectRatio: '1.35',
  objectFit: 'cover',
});

export const Collection = styled('section')(({ theme }) => ({
  maxWidth: siteWidth,
  marginInline: 'auto',
  borderTop: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(5, 3, 7),
  [theme.breakpoints.up('md')]: { padding: theme.spacing(6, 6, 10) },
}));

export const CollectionHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'end',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(4),
  '& h2': {
    margin: theme.spacing(0.75, 0, 0),
    fontFamily: displayFont,
    fontSize: 'clamp(2.2rem, 4vw, 4rem)',
    fontWeight: 400,
    letterSpacing: '-0.055em',
    lineHeight: 1.05,
  },
  '& a': { color: theme.palette.primary.main, textUnderlineOffset: '0.25em' },
}));

export const ArtworkGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(4),
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: theme.spacing(3),
  },
}));

export const ArtworkLink = styled('a')(({ theme }) => ({
  color: 'inherit',
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  gap: theme.spacing(1.5),
  alignContent: 'start',
  textDecoration: 'none',
  '& img': {
    gridColumn: '1 / -1',
    width: '100%',
    height: 'auto',
    aspectRatio: '4 / 5',
    objectFit: 'contain',
    backgroundColor: '#eee8de',
  },
  '&:hover': { color: theme.palette.primary.main },
}));

export const ContactBand = styled('section')(({ theme }) => ({
  backgroundColor: theme.palette.text.primary,
  color: theme.palette.background.default,
}));

export const ContactInner = styled('div')(({ theme }) => ({
  maxWidth: siteWidth,
  marginInline: 'auto',
  padding: theme.spacing(5, 3),
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  '& h2': {
    margin: 0,
    fontFamily: displayFont,
    fontWeight: 400,
    fontSize: 'clamp(1.8rem, 3vw, 3rem)',
  },
  '& a': { color: 'inherit', textUnderlineOffset: '0.25em' },
  [theme.breakpoints.up('md')]: { paddingInline: theme.spacing(6) },
}));
