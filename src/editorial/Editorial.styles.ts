'use client';

import { styled } from '@mui/material/styles';

import { displayFont, galleryColors, siteWidth } from '../site/SiteTheme';

const editorialWidth = 1100;
const portraitImageMin = 230;
const portraitTextMin = 440;

export const EditorialIntro = styled('header')(({ theme }) => ({
  maxWidth: siteWidth,
  marginInline: 'auto',
  padding: theme.spacing(5, 3, 4),
  '& h1': {
    margin: theme.spacing(1.25, 0, 0),
    fontFamily: displayFont,
    fontSize: 'clamp(2.9rem, 8vw, 7.5rem)',
    fontWeight: 400,
    lineHeight: 0.98,
    letterSpacing: '-0.06em',
    textWrap: 'balance',
    overflowWrap: 'anywhere',
  },
  '& span': {
    color: theme.palette.primary.main,
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
  },
  '& p': { maxWidth: '55ch', color: theme.palette.text.secondary },
  '& nav': { display: 'flex', flexWrap: 'wrap', gap: theme.spacing(1), marginTop: theme.spacing(2.5) },
  [theme.breakpoints.up('md')]: { padding: theme.spacing(7, 6, 5) },
  '[data-editorial-tone="contrast"] &': {
    color: galleryColors.ink,
    '& span': { color: galleryColors.accent },
    '& nav a': { color: galleryColors.ink, borderColor: galleryColors.rule },
    '& nav a:hover': { color: galleryColors.accent, borderColor: galleryColors.accent },
  },
}));

export const EditorialDarkIntro = styled('div')({
  backgroundColor: galleryColors.canvas,
});

export const StatementBand = styled('section')(({ theme }) => ({
  backgroundColor: galleryColors.band,
  '--statement-text-background': theme.palette.background.paper,
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.background.paper,
    '--statement-text-background': '#faf6ee',
  },
  padding: theme.spacing(4, 3),
  [theme.breakpoints.up('md')]: { padding: theme.spacing(6) },
}));

export const StatementChapter = styled('div')(({ theme }) => ({
  maxWidth: editorialWidth,
  marginInline: 'auto',
  display: 'grid',
  gap: theme.spacing(2),
  '& h2': {
    margin: 0,
    fontFamily: displayFont,
    fontWeight: 400,
    fontSize: 'clamp(2.15rem, 4.5vw, 4rem)',
    lineHeight: 1.04,
    textWrap: 'balance',
    scrollMarginTop: theme.spacing(2),
  },
}));

export const StatementRow = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2),
  '& > div': { minWidth: 0 },
  '&[data-portrait="true"]': {
    gridTemplateAreas: '"copy" "photo" "caption"',
    '& [data-statement-copy]': {
      gridArea: 'copy',
      display: 'grid',
    },
    '& [data-statement-photo]': { gridArea: 'photo' },
    '& [data-statement-caption]': { gridArea: 'caption' },
    [theme.breakpoints.up(760)]: {
      gridTemplateAreas: '"photo copy" "caption ."',
      gridTemplateColumns: `minmax(${portraitImageMin}px, min(41%, 473px, calc(100% - ${portraitTextMin}px - ${theme.spacing(2)}))) minmax(${portraitTextMin}px, 1fr)`,
      '& [data-statement-photo]': { alignSelf: 'start' },
    },
  },
}));

export const EditorialBody = styled('div')(({ theme }) => ({
  maxWidth: siteWidth,
  marginInline: 'auto',
  padding: theme.spacing(0, 3, 7),
  '[data-layout="cards"] &': {
    display: 'grid',
    gap: theme.spacing(2.5),
    [theme.breakpoints.up('sm')]: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
  },
  [theme.breakpoints.up('md')]: { paddingInline: theme.spacing(6) },
  '[data-layout="photo-essay"] &': { maxWidth: 'none', paddingInline: 0 },
}));

export const EditorialSection = styled('section')(({ theme }) => ({
  display: 'grid',
  minWidth: 0,
  gap: theme.spacing(2),
  padding: theme.spacing(3.5, 0),
  borderTop: `1px solid ${theme.palette.divider}`,
  scrollMarginTop: theme.spacing(2),
  '& h2': {
    margin: 0,
    fontFamily: displayFont,
    fontWeight: 400,
    fontSize: 'clamp(1.75rem, 3.6vw, 3.25rem)',
    lineHeight: 1.08,
    letterSpacing: '-0.035em',
    overflowWrap: 'anywhere',
  },
  '& p': {
    margin: 0,
    maxWidth: '76ch',
    lineHeight: 1.65,
    whiteSpace: 'pre-line',
    overflowWrap: 'anywhere',
  },
  '[data-layout="cards"] &': {
    alignContent: 'start',
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(2.5),
  },
  '[data-layout="essay"] &, [data-layout="archive"] &': {
    maxWidth: editorialWidth,
    marginInline: 'auto',
    justifyItems: 'center',
    '& h2': { textAlign: 'center', textWrap: 'balance' },
    '& > div[data-columns]': { width: '100%' },
  },
  '[data-layout="photo-essay"] &': {
    backgroundColor: galleryColors.band,
    paddingInline: theme.spacing(3),
    '&:nth-of-type(odd)': { backgroundColor: theme.palette.background.paper },
    '& > div': { width: '100%', maxWidth: editorialWidth, marginInline: 'auto' },
    [theme.breakpoints.up('md')]: { padding: theme.spacing(5, 6) },
  },
  '[data-layout="legal"] &': {
    maxWidth: editorialWidth,
    marginInline: 'auto',
    '&:first-of-type > div[data-columns]': { order: 1 },
    [theme.breakpoints.up('md')]: {
      '&:first-of-type': { gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 0.65fr)' },
    },
  },
  '[data-layout="timeline"] &': {
    '& > div[data-columns]': { width: '100%', maxWidth: editorialWidth, marginInline: 'auto' },
    [theme.breakpoints.up('md')]: {
      '&:has(> h2)': { gridTemplateColumns: '9rem minmax(0, 1fr)' },
    },
  },
}));

export const EditorialText = styled('div')(({ theme }) => ({
  maxWidth: '76ch',
  '& p + p': { marginTop: theme.spacing(1.5) },
  '[data-page="statement"] &': {
    width: '100%',
    maxWidth: 'none',
    '& p': {
      maxWidth: '84ch',
      margin: 0,
      lineHeight: 1.65,
      whiteSpace: 'pre-line',
      overflowWrap: 'anywhere',
    },
    '& p + p': { marginTop: theme.spacing(1.5) },
    padding: theme.spacing(2.5, 3),
    backgroundColor: 'var(--statement-text-background)',
    border: `1px solid ${theme.palette.divider}`,
    borderInlineStart: `3px solid ${theme.palette.primary.main}`,
    [theme.breakpoints.up('md')]: { padding: theme.spacing(3.5, 5) },
  },
}));

export const EditorialFigures = styled('div')(({ theme }) => ({
  display: 'grid',
  alignItems: 'start',
  gap: theme.spacing(2),
  '&[data-columns="2"]': {
    [theme.breakpoints.up('sm')]: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
  },
  '&[data-columns="3"]': {
    [theme.breakpoints.up('md')]: { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' },
  },
}));

export const EditorialFigure = styled('figure')(({ theme }) => ({
  margin: 0,
  minWidth: 0,
  '& > button': { marginInline: 'auto' },
  '& img': {
    display: 'block',
    width: '100%',
    maxWidth: '100%',
    height: 'auto',
  },
  '& figcaption': {
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
    marginTop: theme.spacing(1),
    whiteSpace: 'pre-line',
  },
  '[data-layout="cards"] & img': {
    maxHeight: '28rem',
    objectFit: 'contain',
  },
  '[data-layout="archive"] &': { marginBottom: theme.spacing(2) },
  '[data-layout="essay"] & figcaption, [data-layout="photo-essay"] & figcaption, [data-layout="archive"] & figcaption': {
    textAlign: 'center',
  },
}));

export const EditorialLink = styled('a')(({ theme }) => ({
  display: 'inline-block',
  width: 'fit-content',
  maxWidth: '100%',
  padding: theme.spacing(0.85, 1.4),
  color: theme.palette.primary.main,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 99,
  textDecoration: 'none',
  overflowWrap: 'anywhere',
  '&:hover': { borderColor: theme.palette.primary.main },
}));

export const EditorialExcerpt = styled('details')(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  paddingTop: theme.spacing(1.5),
  '& summary': { color: theme.palette.primary.main, cursor: 'pointer', fontWeight: 600 },
  '& > div': { display: 'grid', gap: theme.spacing(1.5), marginTop: theme.spacing(2) },
}));

export const VideoFrame = styled('div')(({ theme }) => ({
  width: '100%',
  '[data-layout="archive"] &': { width: 'min(100%, 54rem)' },
  aspectRatio: '16 / 9',
  backgroundColor: galleryColors.canvas,
  '& video, & iframe': { display: 'block', width: '100%', height: '100%', border: 0 },
  '& button': {
    width: '100%',
    height: '100%',
    padding: theme.spacing(2),
    border: 0,
    color: galleryColors.ink,
    backgroundColor: 'transparent',
    cursor: 'pointer',
    font: 'inherit',
  },
  '& button:hover': { color: galleryColors.accent },
}));
