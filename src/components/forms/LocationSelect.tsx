import React from 'react';
import { Select } from '../ui/Select';
import { CAMPUS_LOCATION_OPTIONS } from '../../data/mockData';

export interface LocationSelectProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  required?: boolean;
}

export const LocationSelect: React.FC<LocationSelectProps> = ({
  label,
  value,
  onChange,
  error,
  required = true,
}) => {
  return (
    <Select
      label={`${label} ${required ? '*' : ''}`}
      value={value}
      onChange={onChange}
      error={error}
      required={required}
      options={CAMPUS_LOCATION_OPTIONS}
    />
  );
};
