// Presentation helpers shared by the public site and the admin portal.

import type { ListingType, PropertyType } from './types';

// Format a price with its currency. Falls back gracefully for unknown codes.
export function formatPrice(
  amount: number,
  currency = 'ZMW',
  listingType?: ListingType,
): string {
  let formatted: string;
  try {
    formatted = new Intl.NumberFormat('en-ZM', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    formatted = `${currency} ${amount.toLocaleString()}`;
  }
  return listingType === 'rent' ? `${formatted} / month` : formatted;
}

const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  house: 'House',
  apartment: 'Apartment',
  land: 'Land',
  commercial: 'Commercial',
  office: 'Office',
  townhouse: 'Townhouse',
};

export function propertyTypeLabel(type: PropertyType): string {
  return PROPERTY_TYPE_LABELS[type] ?? type;
}

export function formatArea(sqm: number | null): string | null {
  if (sqm == null) return null;
  return `${sqm.toLocaleString()} m²`;
}

export function formatDate(iso: string | null): string {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
