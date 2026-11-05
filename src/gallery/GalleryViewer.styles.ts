'use client';

import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';

import { galleryColors } from '../site/SiteTheme';

export const FullscreenDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    display: 'grid',
    gridTemplateRows: 'auto minmax(0, 1fr)',
    width: '100%',
    height: '100dvh',
    margin: 0,
    color: galleryColors.ink,
    backgroundColor: galleryColors.canvas,
  },
});

export const ViewerToolbar = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  padding: theme.spacing(1, 2),
}));

export const ViewerClose = styled('button')(({ theme }) => ({
  minHeight: 44,
  padding: theme.spacing(0.5, 1.5),
  border: `1px solid ${galleryColors.rule}`,
  borderRadius: 99,
  color: 'inherit',
  backgroundColor: 'transparent',
  font: 'inherit',
  cursor: 'pointer',
  '& span': { marginInlineStart: theme.spacing(0.5), fontSize: '1.25em' },
  '&:hover, &:focus-visible': { borderColor: galleryColors.accent },
}));

export const ViewerFigure = styled('figure')(({ theme }) => ({
  minHeight: 0,
  margin: 0,
  display: 'grid',
  gridTemplateRows: 'minmax(0, 1fr) auto',
  gap: theme.spacing(1),
  padding: theme.spacing(0, 2, 2),
  '& img': { display: 'block', width: '100%', height: '100%', objectFit: 'contain' },
  '& figcaption': { color: galleryColors.muted, textAlign: 'center', fontSize: '0.875rem' },
}));

export const ImageTrigger = styled('button')({
  display: 'block',
  width: 'fit-content',
  maxWidth: '100%',
  padding: 0,
  border: 0,
  background: 'none',
  cursor: 'zoom-in',
  '&:focus-visible': { outline: '2px solid currentColor', outlineOffset: 4 },
  '[data-has-cover] &': { width: '100%', color: galleryColors.ink },
});
