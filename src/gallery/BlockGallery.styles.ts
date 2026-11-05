'use client';

import { styled } from '@mui/material/styles';

import { displayFont, galleryColors, siteWidth } from '../site/SiteTheme';

const singleImageWidth = 1100;

export const GalleryBand = styled('div')(({ theme }) => ({
  backgroundColor: galleryColors.band,
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:nth-child(odd of [data-gallery-row])': { backgroundColor: theme.palette.background.paper },
}));

export const Chapter = styled('section')(({ theme }) => ({
  maxWidth: siteWidth,
  marginInline: 'auto',
  padding: theme.spacing(4, 3),
  scrollMarginTop: theme.spacing(2),
  '& > div': {
    maxWidth: singleImageWidth,
    marginInline: 'auto',
    paddingBlock: theme.spacing(2),
    borderBlock: `1px solid ${theme.palette.divider}`,
    display: 'grid',
    gap: theme.spacing(1),
  },
  '& span': {
    color: theme.palette.primary.main,
    fontSize: '0.75rem',
    letterSpacing: '0.13em',
    textTransform: 'uppercase',
    fontWeight: 700,
  },
  '& h2': {
    maxWidth: '30ch',
    margin: 0,
    fontFamily: displayFont,
    fontWeight: 400,
    fontSize: 'clamp(1.8rem, 3.6vw, 3.3rem)',
    lineHeight: 1.1,
    textWrap: 'balance',
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(5, 6, 4),
    '& > div': {
      gridTemplateColumns: '8rem minmax(0, 1fr)',
      alignItems: 'baseline',
      gap: theme.spacing(2),
    },
  },
}));

export const TextBox = styled('div')(({ theme }) => ({
  maxWidth: siteWidth,
  margin: theme.spacing(3, 'auto'),
  paddingInline: theme.spacing(3),
  '& > div': {
    maxWidth: singleImageWidth,
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderInlineStart: `4px solid ${theme.palette.primary.main}`,
  },
  '& > div > h2': { marginBottom: theme.spacing(2) },
  [theme.breakpoints.up('md')]: { paddingInline: theme.spacing(6) },
}));

export const GalleryRow = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  alignItems: 'start',
  gap: theme.spacing(4),
  maxWidth: siteWidth,
  marginInline: 'auto',
  padding: theme.spacing(4, 3),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(5, 6),
    '&[data-columns="2"]': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
    '&[data-columns="3"]': { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' },
  },
}));

export const GalleryTile = styled('figure')(({ theme }) => ({
  width: 'fit-content',
  maxWidth: '100%',
  margin: '0 auto',
  scrollMarginTop: theme.spacing(3),
  '& img': {
    display: 'block',
    width: '100%',
    maxWidth: '100%',
    height: 'auto',
  },
  '& figcaption': {
    marginTop: theme.spacing(1.25),
    color: theme.palette.text.secondary,
    fontSize: '0.9rem',
    lineHeight: 1.5,
    whiteSpace: 'pre-line',
  },
  '[data-columns="1"] &': { maxWidth: `min(100%, ${singleImageWidth}px)` },
}));

export const GalleryText = styled('div')(({ theme }) => ({
  maxWidth: '76ch',
  marginInline: 'auto',
  padding: theme.spacing(5, 3),
  fontSize: '1.05rem',
  lineHeight: 1.65,
  '& h2': {
    margin: 0,
    fontFamily: displayFont,
    fontWeight: 400,
    fontSize: 'clamp(2rem, 4vw, 3.5rem)',
    lineHeight: 1.1,
  },
  '& p': { margin: 0 },
  '& p + p': { marginTop: theme.spacing(2) },
}));
