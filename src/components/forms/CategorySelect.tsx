import React from 'react';
import { Select } from '../ui/Select';
import { REPORT_CATEGORIES } from '../../data/mockData';

export interface CategorySelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  required?: boolean;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({
  value,
  onChange,
  error,
  required = true,
}) => {
  return (
    <Select
      label={`Category ${required ? '*' : ''}`}
      value={value}
      onChange={onChange}
      error={error}
      required={required}
      options={REPORT_CATEGORIES}
    />
  );
};
