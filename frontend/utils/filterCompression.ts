// @ts-nocheck 
import { WorksFilterState, JournalFilterState } from '../libs/types';

const safeDateString = (date: any): string | null => {
    if (!date) return null;
    try {
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (e) {
      console.error('Date conversion error:', e);
      return null;
    }
  };
  export const encodeFilters = (filters: any): string => {
    try {
      const processedFilters: any = {
        ...filters,
        dateRange: {
          from: filters.dateRange?.from ? safeDateString(filters.dateRange.from) : null,
          to: filters.dateRange?.to ? safeDateString(filters.dateRange.to) : null
        },
        startDate: filters.startDate ? safeDateString(filters.startDate) : null,
        endDate: filters.endDate ? safeDateString(filters.endDate) : null
      };
  
      const filtersString = JSON.stringify(processedFilters);
      const encoded = Buffer.from(filtersString).toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
      return encoded;
    } catch (e) {
      console.error('Failed to encode filters:', e);
      return '';
    }
  };
  export const decodeFilters = (encoded: string): any | null => {
    try {
      const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
      const pad = base64.length % 4;
      const paddedBase64 = pad ? base64 + '='.repeat(4 - pad) : base64;
      
      const decoded = Buffer.from(paddedBase64, 'base64').toString();
      const parsed: any = JSON.parse(decoded);
  
      return {
        ...parsed,
        dateRange: {
          from: parsed.dateRange?.from 
            ? new Date(Date.UTC(
                parseInt(parsed.dateRange.from.split('-')[0]),
                parseInt(parsed.dateRange.from.split('-')[1]) - 1,
                parseInt(parsed.dateRange.from.split('-')[2])
              ))
            : null,
          to: parsed.dateRange?.to 
            ? new Date(Date.UTC(
                parseInt(parsed.dateRange.to.split('-')[0]),
                parseInt(parsed.dateRange.to.split('-')[1]) - 1,
                parseInt(parsed.dateRange.to.split('-')[2])
              ))
            : null
        },
        startDate: parsed.startDate 
          ? new Date(Date.UTC(
              parseInt(parsed.startDate.split('-')[0]),
              parseInt(parsed.startDate.split('-')[1]) - 1,
              parseInt(parsed.startDate.split('-')[2])
            )) 
          : null,
        endDate: parsed.endDate 
          ? new Date(Date.UTC(
              parseInt(parsed.endDate.split('-')[0]),
              parseInt(parsed.endDate.split('-')[1]) - 1,
              parseInt(parsed.endDate.split('-')[2])
            )) 
          : null
      };
    } catch (e) {
      console.error('Failed to decode filters:', e);
      return null;
    }
  };