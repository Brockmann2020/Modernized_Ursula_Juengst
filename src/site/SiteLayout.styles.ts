'use client';

import { styled } from '@mui/material/styles';

export const Header = styled('header')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  padding: theme.spacing(2, 3),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '& a, & summary': { color: 'inherit', textDecoration: 'none' },
  '& a:hover, & a[aria-current], & summary:hover, & summary[data-active]': {
    color: theme.palette.primary.main,
    textDecoration: 'underline',
  },
}));

export const Title = styled('h1')(({ theme }) => ({
  ...theme.typography.h1,
  margin: 0,
  padding: theme.spacing(5, 2),
  textAlign: 'center',
}));

export const Footer = styled('footer')(({ theme }) => ({
  padding: theme.spacing(3, 2),
  textAlign: 'center',
  '& a': { color: theme.palette.text.secondary },
}));
