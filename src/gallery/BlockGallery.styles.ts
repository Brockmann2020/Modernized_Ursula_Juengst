'use client';

import { styled } from '@mui/material/styles';

import { displayFont, galleryColors, siteWidth } from '../site/SiteTheme';
import { WorkInner } from './Gallery.styles';

const singleImageWidth = 1100;

export const GalleryBand = styled('section')(({ theme }) => ({
  scrollMarginTop: theme.spacing(3),
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

export const TextBox = styled(WorkInner)(({ theme }) => ({
  paddingBlock: theme.spacing(3),
  '& > div': {
    maxWidth: '100%',
    marginInline: 0,
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderInlineStart: `4px solid ${theme.palette.primary.main}`,
  },
  '& > div > h2': { marginBottom: theme.spacing(2) },
  [theme.breakpoints.down('md')]: { gridTemplateColumns: 'minmax(0, 1fr)' },
  [theme.breakpoints.up('md')]: {
    paddingBlock: theme.spacing(4),
    '& > div': { gridColumn: 2 },
  },
}));

export const GalleryRow = styled(WorkInner)(({ theme }) => ({
  alignItems: 'start',
  '& > div p': { whiteSpace: 'pre-line' },
  [theme.breakpoints.up('md')]: {
    '&[data-columns="2"]': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
    '&[data-columns="3"]': { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' },
  },
}));

export const GalleryTile = styled('figure')(({ theme }) => ({
  minWidth: 0,
  margin: 0,
  scrollMarginTop: theme.spacing(3),
  '& > div > button img': {
    display: 'block',
    width: '100%',
    maxWidth: '100%',
    height: 'auto',
  },
  '& [data-gallery-details]': {
    gridTemplateColumns: 'minmax(0, 1fr)',
    marginTop: theme.spacing(3),
    '& figcaption': { whiteSpace: 'pre-line' },
  },
  '& > figcaption': {
    marginBottom: theme.spacing(2),
    '& h2': { fontSize: 'clamp(2rem, 3.3vw, 3.5rem)' },
    '& p': { whiteSpace: 'pre-line' },
  },
  [theme.breakpoints.up('md')]: {
    '[data-columns="2"] &, [data-columns="3"] &': {
      display: 'grid',
      gridTemplateRows: 'subgrid',
      gridTemplateColumns: 'minmax(0, 1fr)',
      gridRow: 'span 2',
      alignItems: 'start',
      rowGap: theme.spacing(2),
      '& > figcaption': { marginBottom: 0 },
    },
  },
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
