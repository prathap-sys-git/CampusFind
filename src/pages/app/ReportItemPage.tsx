import React from 'react';
import { ItemReportForm } from '../../components/forms/ItemReportForm';
import type { ItemType } from '../../types';

export interface ReportItemPageProps {
  type: ItemType;
}

export const ReportItemPage: React.FC<ReportItemPageProps> = ({ type }) => {
  return <ItemReportForm key={type} type={type} />;
};
