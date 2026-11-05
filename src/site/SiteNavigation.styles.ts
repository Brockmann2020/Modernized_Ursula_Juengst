'use client';

import { styled } from '@mui/material/styles';

export const Navigation = styled('nav')(({ theme }) => ({
  '& ul': { listStyle: 'none', padding: 0, margin: 0 },
  '& li': { padding: theme.spacing(0.75, 0) },
  '& summary': { cursor: 'pointer' },
  '& details ul': { paddingLeft: theme.spacing(2) },
  [theme.breakpoints.down('lg')]: { flexBasis: '100%', order: 1 },
  [theme.breakpoints.up('lg')]: {
    '& > ul': { display: 'flex', gap: theme.spacing(2), alignItems: 'center' },
    '& details': { position: 'relative' },
    '& details ul': {
      position: 'absolute',
      zIndex: 1,
      minWidth: 'max-content',
      padding: theme.spacing(1, 2),
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[2],
    },
  },
}));
