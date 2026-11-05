'use client';

import { styled } from '@mui/material/styles';

import { displayFont, siteWidth } from '../site/SiteTheme';

export const NewsIntro = styled('header')(({ theme }) => ({
  maxWidth: siteWidth,
  marginInline: 'auto',
  padding: theme.spacing(6, 3),
  '& h1': {
    fontFamily: displayFont,
    fontSize: 'clamp(3.8rem, 10vw, 9rem)',
    fontWeight: 400,
    letterSpacing: '-0.07em',
    lineHeight: 0.95,
    margin: theme.spacing(1.5, 0, 2),
  },
  '& p': { maxWidth: '38ch', fontSize: '1.1rem', color: theme.palette.text.secondary },
  '& nav': { display: 'flex', flexWrap: 'wrap', gap: theme.spacing(1), marginTop: theme.spacing(3) },
  '& nav a': {
    color: 'inherit',
    textDecoration: 'none',
    border: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 1.75),
    borderRadius: 99,
    '&:hover': { color: theme.palette.primary.main, borderColor: theme.palette.primary.main },
  },
  [theme.breakpoints.up('md')]: { padding: theme.spacing(8, 6, 6) },
}));

export const NewsKicker = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: '0.75rem',
  letterSpacing: '0.13em',
  textTransform: 'uppercase',
  fontWeight: 700,
}));

export const NewsSection = styled('section')(({ theme }) => ({
  maxWidth: siteWidth,
  marginInline: 'auto',
  padding: theme.spacing(4, 3, 6),
  '& > h2': {
    margin: theme.spacing(0, 0, 3),
    fontFamily: displayFont,
    fontWeight: 400,
    fontSize: 'clamp(2.25rem, 4vw, 4rem)',
  },
  [theme.breakpoints.up('md')]: { paddingInline: theme.spacing(6) },
}));

export const NewsArticle = styled('article')(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(3),
  borderTop: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(3.5, 0),
  scrollMarginTop: theme.spacing(2),
  '&[data-featured="true"]': {
    borderTopColor: theme.palette.primary.main,
    backgroundColor: theme.palette.background.paper,
    paddingInline: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  '& h3': {
    margin: theme.spacing(1, 0, 1.5),
    fontFamily: displayFont,
    fontSize: 'clamp(2rem, 4vw, 4rem)',
    fontWeight: 400,
    letterSpacing: '-0.04em',
    lineHeight: 1.05,
    textWrap: 'balance',
    overflowWrap: 'anywhere',
  },
  '& p': { whiteSpace: 'pre-line', overflowWrap: 'anywhere' },
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)',
    paddingBlock: theme.spacing(5),
    '&[data-featured="true"]': { paddingInline: theme.spacing(3) },
  },
}));

export const NewsLinks = styled('ul')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  padding: 0,
  margin: theme.spacing(2, 0, 0),
  listStyle: 'none',
  '& li': { maxWidth: '100%' },
  '& a': {
    display: 'inline-block',
    padding: theme.spacing(0.75, 1.25),
    color: theme.palette.primary.main,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 99,
    textDecoration: 'none',
    fontSize: '0.875rem',
    overflowWrap: 'anywhere',
    '&:hover': { borderColor: theme.palette.primary.main },
  },
}));

export const NewsImages = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(1.5),
  alignContent: 'start',
  '&[data-pair="true"]': {
    [theme.breakpoints.up('sm')]: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
  },
}));

export const NewsFigure = styled('figure')(({ theme }) => ({
  margin: 0,
  '& img': { display: 'block', width: '100%', height: 'auto' },
  '&[data-carousel="true"] img': {
    aspectRatio: '4 / 3',
    objectFit: 'contain',
    backgroundColor: theme.palette.background.paper,
  },
  '& figcaption': {
    marginTop: theme.spacing(0.75),
    color: theme.palette.text.secondary,
    fontSize: '0.85rem',
  },
}));

export const CarouselControls = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
  '& button': {
    minWidth: 44,
    minHeight: 44,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 99,
    color: 'inherit',
    backgroundColor: theme.palette.background.paper,
    cursor: 'pointer',
    font: 'inherit',
    '&:hover': { borderColor: theme.palette.primary.main, color: theme.palette.primary.main },
  },
}));
