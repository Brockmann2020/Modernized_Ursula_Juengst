'use client';

import { styled } from '@mui/material/styles';
import { galleryWidth, surfaces } from '../site/SiteTheme';

export const Band = styled('div')(({ theme }) => ({
  backgroundColor: surfaces.light,
  padding: theme.spacing(4, 2),
  '&:nth-of-type(even)': { backgroundColor: surfaces.dark },
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(6, 3) },
}));

export const Figure = styled('figure')(({ theme }) => ({
  margin: '0 auto',
  width: 'fit-content',
  maxWidth: `min(100%, ${galleryWidth}px)`,
  '& figcaption': { marginTop: theme.spacing(1.5), color: theme.palette.text.secondary },
}));

export const Image = styled('img')({
  display: 'block',
  maxWidth: '100%',
  maxHeight: '85svh',
  width: 'auto',
  height: 'auto',
  '&[data-detail="true"]': { maxHeight: 'none' },
});
