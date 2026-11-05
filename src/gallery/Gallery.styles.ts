'use client';

import { styled } from '@mui/material/styles';

import { displayFont, galleryColors, siteWidth } from '../site/SiteTheme';

export const Intro = styled('section')({
  color: galleryColors.ink,
  backgroundColor: galleryColors.canvas,
});

export const IntroInner = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(4),
  maxWidth: siteWidth,
  marginInline: 'auto',
  padding: theme.spacing(5, 3),
  '& > div > span': {
    color: galleryColors.accent,
    textTransform: 'uppercase',
    letterSpacing: '0.16em',
    fontSize: '0.72rem',
    fontWeight: 700,
  },
  '& h1': {
    margin: theme.spacing(1.5, 0, 2),
    fontFamily: displayFont,
    fontWeight: 400,
    fontSize: 'clamp(3.4rem, 8vw, 8rem)',
    letterSpacing: '-0.065em',
    lineHeight: 0.95,
    overflowWrap: 'anywhere',
  },
  '& p': {
    maxWidth: '37ch',
    margin: 0,
    color: galleryColors.muted,
    fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
    lineHeight: 1.55,
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(6, 6, 5),
    alignItems: 'center',
    '&[data-has-cover="true"]': { gridTemplateColumns: 'minmax(0, 0.9fr) minmax(0, 1.1fr)' },
  },
}));

export const Cover = styled('figure')(({ theme }) => ({
  margin: 0,
  '& img': {
    display: 'block',
    width: '100%',
    height: 'auto',
    aspectRatio: '1.85',
    objectFit: 'cover',
  },
  '& figcaption': {
    marginTop: theme.spacing(1),
    color: galleryColors.muted,
    textAlign: 'right',
    fontSize: '0.8rem',
  },
}));

export const Index = styled('nav')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const IndexInner = styled('div')(({ theme }) => ({
  maxWidth: siteWidth,
  marginInline: 'auto',
  padding: theme.spacing(2.5, 3),
  display: 'flex',
  alignItems: 'baseline',
  flexWrap: 'wrap',
  gap: theme.spacing(1.5, 4),
  '& > div': { display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: theme.spacing(1.5) },
  '& > div > span': { color: theme.palette.text.secondary, fontSize: '0.8rem' },
  '& ul': {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: theme.spacing(0.75),
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  '& a': {
    display: 'inline-block',
    padding: theme.spacing(0.9, 1.5),
    color: theme.palette.text.primary,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 100,
    fontSize: '0.875rem',
    textDecoration: 'none',
    '&:hover': { color: theme.palette.primary.main, borderColor: theme.palette.primary.main },
  },
  [theme.breakpoints.up('md')]: { paddingInline: theme.spacing(6) },
}));

export const Work = styled('section')(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:nth-of-type(odd)': { backgroundColor: theme.palette.background.paper },
}));

export const WorkInner = styled('div')(({ theme }) => ({
  maxWidth: siteWidth,
  marginInline: 'auto',
  padding: theme.spacing(5, 3),
  display: 'grid',
  gap: theme.spacing(3),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(7, 6),
    gridTemplateColumns: 'minmax(0, 0.6fr) minmax(0, 1.4fr)',
    gap: theme.spacing(4),
  },
}));

export const WorkInfo = styled('div')(({ theme }) => ({
  '& h2': {
    margin: 0,
    fontFamily: displayFont,
    fontWeight: 400,
    fontSize: 'clamp(2.4rem, 4vw, 4.4rem)',
    lineHeight: 1.04,
    letterSpacing: '-0.045em',
    overflowWrap: 'anywhere',
  },
  '& p': { margin: theme.spacing(1.5, 0, 0), color: theme.palette.text.secondary },
}));

export const GalleryImageFrame = styled('figure')(({ theme }) => ({
  margin: 0,
  scrollMarginTop: theme.spacing(3),
  '& img': {
    display: 'block',
    maxWidth: '100%',
    maxHeight: '85svh',
    width: 'auto',
    height: 'auto',
  },
  '& figcaption': {
    marginTop: theme.spacing(1),
    color: theme.palette.text.secondary,
    fontSize: '0.85rem',
  },
}));

export const DetailGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2.5),
  [theme.breakpoints.up('md')]: { gridColumn: 2 },
}));
