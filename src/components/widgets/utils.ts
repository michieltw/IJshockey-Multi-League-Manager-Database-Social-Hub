import React from 'react';

// Helper to display fallback for missing data
export const displayStat = (value: number | string | undefined | null): React.ReactNode => {
  if (value === undefined || value === null) {
    return '-';
  }
  return value;
};
